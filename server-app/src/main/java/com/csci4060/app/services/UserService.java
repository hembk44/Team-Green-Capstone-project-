package com.csci4060.app.services;

import java.util.List;
<<<<<<< HEAD
import java.util.Set;

import com.csci4060.app.model.Role;
=======

>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import com.csci4060.app.model.User;

public interface UserService {

	User save(User user);
	
	List<User> findAll();
	
	void delete(String email);
	
	User findByEmail(String email);
	
	User findByUsername(String username);
	
	User findById(Long id);
	
	User update(User user);
	
	Boolean existsByUsername(String username);
	
	Boolean existsByEmail(String email);
<<<<<<< HEAD
	
	List<User> findAllByRoles(Set<Role>roles ); 
=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
}
