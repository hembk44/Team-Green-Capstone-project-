package com.csci4060.app.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
public class Department {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	@Size(min=3, max=50)
	private String name;
	
	@OneToOne(targetEntity = User.class)
	private User admin;
	
	@OneToMany(targetEntity = User.class)
	private List<User> faculties;
	
	@OneToMany(targetEntity = User.class)
	private List<User> students;
}
