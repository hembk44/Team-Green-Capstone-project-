package com.csci4060.app.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.ExceptionResolver;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.User;
import com.csci4060.app.services.RoleService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/admin", produces = "application/json")
public class AdminController extends ExceptionResolver {
	
	
	@Autowired
	UserService userService;
	
	@Autowired
	RoleService roleService;
	
	@PutMapping(path = "/changeRole")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse changeRoles( @Valid @RequestParam("email") String email, @RequestParam("role") RoleName role) {
		
		User user = userService.findByEmail(email);
		
		Role userRole = roleService.findByName(role);
		
		user.getRoles().clear();
		user.getRoles().add(userRole);
		
		userService.save(user);
		return new APIresponse(HttpStatus.OK.value(), "The privileges allowed by chosen roles has been given to the User", null);
		
		
	}

}
