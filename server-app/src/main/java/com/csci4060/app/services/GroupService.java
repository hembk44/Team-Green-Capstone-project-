package com.csci4060.app.services;

import java.util.List;
import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;

public interface GroupService {

	Group save(Group group);
	Group findByNameAndSemesterAndTypeAndCreatedBy(String name, String semester,String type, User createdBy);
	Group findByNameAndSemesterAndType(String name, String semester,String type);
	List<Group> findAllByCreatedBy(User user);
	Group findById(Long id);
	List<Group> findAllByOtherOwners(User otherOwner);
	void delete(Group group);
}
