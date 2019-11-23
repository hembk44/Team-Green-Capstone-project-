package com.csci4060.app.services.implementation;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.major.Course;
import com.csci4060.app.repository.courseRepo.CourseRepository;
import com.csci4060.app.services.CourseService;

@Service(value = "courseService")
public class CourseServiceImpl implements CourseService{

	@Autowired
	CourseRepository courseRepository;
	
	@Override
	public Course save(Course course) {
		return courseRepository.save(course);
	}

	@Override
	public Course findByTitleAndDescription(String title, String description) {
		Optional<Course> optCourse = courseRepository.findByTitleAndDescription(title, description);
		
		if(optCourse.isPresent()) {
			return optCourse.get();
		}
		return null;
	}

	
}
