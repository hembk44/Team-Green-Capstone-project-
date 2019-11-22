package com.csci4060.app.model.major;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Course {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String title;
	
	private String description;
	
	public Course(String title, String description) {
		this.title = title;
		this.description = title;
	}

	public Course() {
		super();
	}
	
	
}
