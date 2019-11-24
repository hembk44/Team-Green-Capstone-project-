package com.csci4060.app.services;

import java.util.List;

import com.csci4060.app.model.major.Major;

public interface MajorService {

	Major save(Major major);
	
	Major findByName(String name);
	
	List<Major> findAll();
	
	Major findById(Long id);
}
