package com.csci4060.app.repository.majorRepo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.major.Major;

public interface MajorRepository extends JpaRepository<Major,Long>{

	
	Optional<Major> findByNameIgnoreCase(String name);
}
