package com.csci4060.app.services;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.model.Role;
import com.csci4060.app.model.User;

public interface FileReadService {

	List<User> readFile(MultipartFile file, Set<Role> userRole) throws IOException;
	
	List<User> readFileForGroup(MultipartFile file) throws IOException;
}
