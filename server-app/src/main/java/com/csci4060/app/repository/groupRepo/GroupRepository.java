package com.csci4060.app.repository.groupRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.group.Group;

public interface GroupRepository extends JpaRepository<Group, Long>{
	
	Optional<Group> findByNameAndSemesterTermAndSemesterYearAndTypeAndCreatedByAllIgnoreCase(String name, String semesterTerm, int semesterYear, String type, User createdBy);
	Optional<Group> findByNameAndSemesterTermAndSemesterYearAndTypeAllIgnoreCase(String name, String semesterTerm, int semesterYear, String type); 
	Optional<List<Group>> findAllByCreatedByOrderByCreatedAtDesc(User user);
	Optional<Group> findById(Long id);
	Optional<List<Group>> findAllByOtherOwnersOrderByCreatedAtDesc(User otherOwner);
	void delete(Group group);
}
