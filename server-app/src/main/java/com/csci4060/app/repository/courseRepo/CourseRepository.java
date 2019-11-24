package com.csci4060.app.repository.courseRepo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.major.Course;

public interface CourseRepository extends JpaRepository<Course, Long>{
	
	Optional<Course> findByTitleAndDescription(String title, String description);
}
