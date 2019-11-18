package com.csci4060.app.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;
import com.csci4060.app.model.group.GroupDummy;
import com.csci4060.app.model.group.GroupEmail;
import com.csci4060.app.model.group.GroupShare;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.GroupService;
import com.csci4060.app.services.RoleService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/group", produces = "application/json")
public class GroupController {

	@Autowired
	UserService userService;

	@Autowired
	GroupService groupService;

	@Autowired
	RoleService roleService;
	
	@Autowired
	EmailSenderService emailSenderService;

	@PostMapping(path = "/createFromList", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse createGroupFromList(@Valid @RequestBody GroupDummy groupDummy) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(username);

		String groupType = groupDummy.getType();
		String groupName = groupDummy.getName();
		String groupSemesterTerm = groupDummy.getSemesterTerm();
		int groupSemesterYear = groupDummy.getSemesterYear();

		List<User> otherOwnersList = new ArrayList<User>();

		if (groupType.equals("Course")) {

			if (groupService.findByNameAndSemesterTermAndSemesterYearAndType(groupName, groupSemesterTerm, groupSemesterYear, groupType) != null) {
				return new APIresponse(HttpStatus.CONFLICT.value(), "Course with name: " + groupName + " on semester: "
						+ groupSemesterTerm+ " "+groupSemesterYear + " is already in the database. Please try a different name or semester.",
						null);
			}

			Set<Role> role = new HashSet<>();

			Role adminRole = roleService.findByName(RoleName.ROLE_ADMIN);
			Role facultyRole = roleService.findByName(RoleName.ROLE_PM);

			role.add(adminRole);
			otherOwnersList = userService.findAllByRoles(role);

			role.clear();
			role.add(facultyRole);
			List<User> facultyList = userService.findAllByRoles(role);

			if (facultyList != null) {
				otherOwnersList = ListUtils.union(otherOwnersList, facultyList);
			}

			if (otherOwnersList.contains(createdBy)) {
				otherOwnersList.remove(createdBy);
			}

		} else {
			if (groupService.findByNameAndSemesterTermAndSemesterYearAndTypeAndCreatedBy(groupName, groupSemesterTerm, groupSemesterYear,groupType,
					createdBy) != null) {
				return new APIresponse(HttpStatus.CONFLICT.value(), "Group with name: " + groupName + " on semester: "
						+ groupSemesterTerm +" " +groupSemesterYear+" has already been created by you. Please try a different name.", null);
			}
		}

		List<String> emailsFromDummy = groupDummy.getRecipients();

		List<User> recipients = new ArrayList<>();

		for (String email : emailsFromDummy) {
			if (userService.existsByEmail(email)) {
				recipients.add(userService.findByEmail(email));
			}
		}

		Group group = new Group(groupName, groupDummy.getDescription(), groupType, groupSemesterTerm, groupSemesterYear, recipients,
				otherOwnersList, createdBy);

		groupService.save(group);

		return new APIresponse(HttpStatus.CREATED.value(), "Group with name "+groupName+ " has been succesfully created", group);
	}

	@GetMapping(path = "/fetch")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getAllGroups() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		List<Group> groups = new ArrayList<Group>();
		List<Group> createdGroups = groupService.findAllByCreatedBy(user);
		List<Group> courseGroups = groupService.findAllByOtherOwners(user);

		if (createdGroups == null && courseGroups == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "You do not have any groups", null);
		}

		if (createdGroups != null && courseGroups == null) {
			groups = createdGroups;
		} else if (createdGroups == null && courseGroups != null) {
			groups = courseGroups;
		} else {
			groups = ListUtils.union(createdGroups, courseGroups);
		}
		return new APIresponse(HttpStatus.OK.value(), "All groups successfully sent", groups);
	}

	@GetMapping(path = "/getDetails/{id}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getGroupDetails(@PathVariable("id") Long groupId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Group group = groupService.findById(groupId);

		if (group == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Group with id " + groupId + " does not exist",
					null);
		}

		if (group.getType().equals("Custom") && group.getCreatedBy() != user && !group.getOtherOwners().contains(user)) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}

		//List<User> membersList = group.getMembers();

//		List<MemberNameAndEmail> nameAndEmail = new ArrayList<MemberNameAndEmail>();
//
//		for (User member : membersList) {
//			nameAndEmail.add(new MemberNameAndEmail(member.getName(), member.getEmail()));
//		}

//		if (nameAndEmail.isEmpty()) {
//			nameAndEmail = null;
//		}

//		GroupResponse response = new GroupResponse(group.getName(), group.getDescription(), group.getType(),
//				group.getSemesterTerm(), group.getSemesterYear(), nameAndEmail);

		return new APIresponse(HttpStatus.OK.value(), "Group details successfully sent", group);
	}

	@PutMapping(path = "/edit/{id}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse editGroup(@Valid @RequestBody GroupDummy groupDummy, @PathVariable("id") Long groupId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Group group = groupService.findById(groupId);

		if (group == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Group with id " + groupId + " does not exist",
					null);
		}

		if (group.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}

		group.setName(groupDummy.getName());
		group.setDescription(groupDummy.getDescription());
		group.setSemesterTerm(groupDummy.getSemesterTerm());
		group.setSemesterYear(groupDummy.getSemesterYear());

		List<String> emailsFromDummy = groupDummy.getRecipients();

		List<User> recipients = new ArrayList<>();

		for (String email : emailsFromDummy) {
			if (userService.existsByEmail(email)) {
				recipients.add(userService.findByEmail(email));
			}
		}

		group.setMembers(recipients);
		groupService.save(group);

		return new APIresponse(HttpStatus.OK.value(), "Group has been successfully edited", group);
	}

	@PostMapping(path = "/share")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse shareGroup(@Valid @RequestBody GroupShare groupShare) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Long groupId = groupShare.getId();

		Group group = groupService.findById(groupId);

		if (group == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Group with id " + groupId + " does not exist",
					null);
		}

		if (group.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}

		if (group.getType().equals("Course")) {
			return new APIresponse(HttpStatus.CONFLICT.value(),
					"Group with id " + groupId
							+ " is a Course group. This group is already shared to other faculties during its creation",
					null);
		}

		List<String> emailsFromGroupShare = groupShare.getEmails();
		List<String> validEmails = new ArrayList<String>();

		List<User> otherOwners = group.getOtherOwners();
		User createdBy = group.getCreatedBy();

		for (String email : emailsFromGroupShare) {
			User userToAdd = userService.findByEmail(email);
			if (userToAdd != null) {
				if (!otherOwners.contains(userToAdd) && userToAdd != createdBy) {
					validEmails.add(email);
					otherOwners.add(userToAdd);
				}

			}
		}

		group.setOtherOwners(otherOwners);
		groupService.save(group);

		return new APIresponse(HttpStatus.OK.value(), "Group has been successfully shared to " + validEmails, group);
	}

	@DeleteMapping(path = "/delete/{id}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse deleteGroup(@PathVariable("id") Long groupId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Group group = groupService.findById(groupId);

		if (group == null) {
			return new APIresponse(HttpStatus.OK.value(), "Group with id " + groupId + " does not exists.", null);
		}

		if (group.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}

		groupService.delete(group);

		return new APIresponse(HttpStatus.OK.value(), "Group with id " + groupId + " has been successfully deleted.",
				group);
	}
	
	@PostMapping(path = "/sendEmail")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse sendEmail(@Valid @RequestBody GroupEmail groupEmail) {
		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);
		
		Long groupId = groupEmail.getId();
		
		Group group = groupService.findById(groupId);
		
		if (group == null) {
			return new APIresponse(HttpStatus.OK.value(), "Group with id " + groupId + " does not exists.", null);
		}
		
		if (group.getType().equals("Custom") && group.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}
		
		List<User> memberList = group.getMembers();
		
		List<String> emailList = new ArrayList<String>();
		
		for (User member:memberList) {
			emailList.add(member.getEmail());
		}
		
		String[] emails = emailList.toArray(new String[emailList.size()]);
		
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		
		mailMessage.setTo(emails);
		mailMessage.setSubject(groupEmail.getTitle());
		mailMessage.setFrom(user.getEmail());
		mailMessage.setText(groupEmail.getMessage());

		emailSenderService.sendEmail(mailMessage);
		
		return new APIresponse(HttpStatus.OK.value(), "Emails have been successfully sent",
				emailList);
	}
}
