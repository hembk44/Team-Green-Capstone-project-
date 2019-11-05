package com.csci4060.app.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;
import com.csci4060.app.model.group.GroupDummy;
import com.csci4060.app.model.group.GroupResponse;
import com.csci4060.app.model.group.MemberNameAndEmail;
import com.csci4060.app.services.GroupService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/group", produces = "application/json")
public class GroupController {

	@Autowired
	UserService userService;

	@Autowired
	GroupService groupService;

	@PostMapping(path = "/createFromList", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse createGroupFromList(@Valid @RequestBody GroupDummy groupDummy) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(username);

		String groupName = groupDummy.getName();

		if (groupService.findByNameAndCreatedBy(groupName, createdBy) != null) {
			return new APIresponse(HttpStatus.CONFLICT.value(),
					"Group with name " + groupName + " has already been created. Please try a different name.", null);
		}

		List<String> emailsFromDummy = groupDummy.getRecipients();
		
		List<User> recipients = new ArrayList<>();

		for (String email : emailsFromDummy) {
			if (userService.existsByEmail(email)) {
				recipients.add(userService.findByEmail(email));
			}
		}

		Group group = new Group(groupName, groupDummy.getDescription(), recipients, createdBy);

		groupService.save(group);

		return new APIresponse(HttpStatus.CREATED.value(), "Group with name has been succesfully created", group);
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

		List<Group> groups = groupService.findAllByCreatedBy(user);

		if (groups == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "No groups created yet", null);
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

		if (group.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}

		List<User> membersList = group.getRecipients();

		List<MemberNameAndEmail> nameAndEmail = new ArrayList<MemberNameAndEmail>();

		for (User member : membersList) {
			nameAndEmail.add(new MemberNameAndEmail(member.getName(), member.getEmail()));
		}

		if(nameAndEmail.isEmpty()) {
			nameAndEmail = null;
		}
		
		GroupResponse response = new GroupResponse(group.getName(), group.getDescription(), nameAndEmail);

		return new APIresponse(HttpStatus.OK.value(), "Group details successfully sent", response);
	}
	
	@PutMapping(path = "/edit/{id}", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse editGroup(@Valid @RequestBody GroupDummy groupDummy, @PathVariable("id") Long groupId) {	
		
		Group group = groupService.findById(groupId);
		
		if (group == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Group with id " + groupId + " does not exist",
					null);
		}
		
		group.setName(groupDummy.getName());
		group.setDescription(groupDummy.getDescription());
		
		List<String> emailsFromDummy = groupDummy.getRecipients();
		
		List<User> recipients = new ArrayList<>();

		for (String email : emailsFromDummy) {
			if (userService.existsByEmail(email)) {
				recipients.add(userService.findByEmail(email));
			}
		}
		
		group.setRecipients(recipients);
		groupService.save(group);
		
		return new APIresponse(HttpStatus.OK.value(), "Group has been successfully edited", group);
	}
}
