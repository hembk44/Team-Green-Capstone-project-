package com.csci4060.app.model.group;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.csci4060.app.model.User;
import com.csci4060.app.model.major.Major;

import lombok.Data;

@Data
@Entity
@Table(name = "UserGroup")
public class Group {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message= "Name must not be empty and need to have at least one character!")
	private String name;
	
	@NotBlank(message= "Event type must not be empty and need to have at least one character!")
	private String type;
	
	private String description;
	
	@NotBlank(message= "Semester term not be empty and need to have at least one character!")
	private String semesterTerm;
	
	@ManyToOne(targetEntity = Major.class)
	private Major major;
	
	private int semesterYear;
	
	private Date createdAt;
	
	@ManyToMany(targetEntity = User.class)
	private List<User> members;
	
	@ManyToMany(targetEntity = User.class)
	private List<User> otherOwners;
	
	@ManyToOne(targetEntity = User.class)
	private User createdBy;
	
	@PrePersist
	void createdAt() {
		this.createdAt = new Date();
	}
	
	public Group(String name, String description, String type, Major major, String semesterTerm, int semesterYear, List<User> members, List<User> otherOwners, User createdBy) {
		this.name = name;
		this.description = description;
		this.type = type;
		this.major = major;
		this.semesterTerm = semesterTerm;
		this.semesterYear = semesterYear;
		this.members = members;
		this.otherOwners = otherOwners;
		this.createdBy = createdBy;
	}

	public Group() {
		super();
	}
	
}