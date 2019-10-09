package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.repository.RoleRepository;
import com.csci4060.app.services.RoleService;

@Service(value = "roleService")
public class RoleServiceImpl implements RoleService{

	@Autowired
	RoleRepository roleRepo;
	
	@Override
	public Role findByName(RoleName roleName) {
		return roleRepo.findByName(roleName)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
	}

	
}

