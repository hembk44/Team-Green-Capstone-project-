package com.csci4060.app.services;

import com.csci4060.app.model.major.Course;


public interface CourseService {

	Course save(Course course);
	
	Course findByTitleAndDescription(String title, String description);
}
