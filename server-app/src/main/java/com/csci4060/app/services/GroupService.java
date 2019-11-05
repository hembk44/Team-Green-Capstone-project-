package com.csci4060.app.services;

import java.util.List;

import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;

public interface GroupService {

	Group save(Group group);
	Group findByNameAndCreatedBy(String name, User createdBy);
	List<Group> findAllByCreatedBy(User user);
	Group findById(Long id);
}
