package com.csci4060.app.services;

import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;

public interface RoleService {

	Role findByName(RoleName roleName);
}
