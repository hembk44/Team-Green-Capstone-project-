package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;
import com.csci4060.app.repository.groupRepo.GroupRepository;
import com.csci4060.app.services.GroupService;

@Service(value = "groupService")
public class GroupServiceImpl implements GroupService{

	@Autowired
	GroupRepository groupRepo;
	
	@Override
	public Group save(Group group) {
		return groupRepo.save(group);
	}

	@Override
	public Group findByNameAndSemesterTermAndSemesterYearAndTypeAndCreatedBy(String name, String semesterTerm, int semesterYear, String type, User createdBy) {
		Optional<Group> optGroup = groupRepo.findByNameAndSemesterTermAndSemesterYearAndTypeAndCreatedByAllIgnoreCase(name, semesterTerm, semesterYear, type, createdBy);

		if (optGroup.isPresent()) {
			return optGroup.get();
		}
		return null;
	}

	@Override
	public List<Group> findAllByCreatedBy(User user) {
		Optional<List<Group>> optGroup = groupRepo.findAllByCreatedByOrderByCreatedAtDesc(user);

		if (optGroup.isPresent()) {
			return optGroup.get();
		}
		return null;
	}

	@Override
	public Group findById(Long id) {
		Optional<Group> optGroup = groupRepo.findById(id);

		if (optGroup.isPresent()) {
			return optGroup.get();
		}
		return null;
	}

	@Override
	public Group findByNameAndSemesterTermAndSemesterYearAndType(String name, String semesterTerm, int semesterYear, String type) {
		Optional<Group> optGroup = groupRepo.findByNameAndSemesterTermAndSemesterYearAndTypeAllIgnoreCase(name, semesterTerm, semesterYear, type);

		if (optGroup.isPresent()) {
			return optGroup.get();
		}
		return null;
	}

	@Override
	public List<Group> findAllByOtherOwners(User otherOwner) {
		Optional<List<Group>> optGroup = groupRepo.findAllByOtherOwnersOrderByCreatedAtDesc(otherOwner);

		if (optGroup.isPresent()) {
			return optGroup.get();
		}
		return null;
	}

	@Override
	public void delete(Group group) {
		
		group.getMembers().clear();
		group.getOtherOwners().clear();
		groupRepo.delete(group);
	}

}
