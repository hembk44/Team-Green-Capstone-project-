package com.csci4060.app.model.major;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

@Data
@Entity
public class Major {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	String name;
	
	@OneToMany(targetEntity = Course.class)
	List<Course> courses;
	
	public Major(String name, List<Course> courses) {
		this.name = name;
		this.courses = courses;
	}

	public Major() {
		super();
	}
	
}
