package com.csci4060.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;
import com.csci4060.app.services.GroupService;
import com.csci4060.app.services.UserService;

@RestController
public class TestRestAPIs {
	
	@Autowired
	GroupService groupService;
	
	@Autowired
	UserService userService;

	 @GetMapping("/api/test/user")
	  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	  public String userAccess() {
	    return ">>> User Contents!";
	  }
	  
	  @GetMapping("/api/test/pm")
	  @PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	  public String projectManagementAccess() {
	    return ">>> Board Management Project";
	  }
	  
	  @GetMapping("/api/test/admin")
	  @PreAuthorize("hasRole('ADMIN')")
	  public String adminAccess() {
	    return ">>> Admin Contents";
	  }
	  
	  @GetMapping("/api/test/admin/groups")
	  @PreAuthorize("hasRole('ADMIN')")
	  public List<Group> getMemberGroups() {
	    
		  User user = userService.findByEmail("maharjr@warhawks.ulm.edu");
		  
		  List<Group> memberGroups = groupService.findAllByMembers(user);
			
			System.out.println("Groups: "+memberGroups);
			
			if(memberGroups != null) {
				for(Group group: memberGroups) {
					group.getMembers().remove(user);
					groupService.save(group);
				}
			}
		  
		  return memberGroups;
	  }
}
