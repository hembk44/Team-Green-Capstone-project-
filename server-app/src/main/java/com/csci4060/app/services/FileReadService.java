package com.csci4060.app.services;

import java.io.IOException;
import java.util.List;
<<<<<<< HEAD
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;


import com.csci4060.app.model.RoleName;

import com.csci4060.app.model.Role;

=======

import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.model.RoleName;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import com.csci4060.app.model.User;

public interface FileReadService {

<<<<<<< HEAD

	List<User> readFile(MultipartFile file, Set<Role> userRole) throws IOException;

=======
	List<User> readFile(MultipartFile file, RoleName role) throws IOException;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
}
