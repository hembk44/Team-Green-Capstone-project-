package com.csci4060.app.model.group;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.csci4060.app.model.User;
import lombok.Data;

@Data
@Entity
@Table(name = "groups")
public class Group {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotBlank
	private String name;
	
	@NotBlank
	private String type;
	
	private String description;
	
	@NotBlank
	private String semesterTerm;
	
	private int semesterYear;
	
	private Date createdAt;
	
	@ManyToMany(fetch = FetchType.LAZY, targetEntity = User.class)
	private List<User> members;
	
	@ManyToMany(fetch = FetchType.LAZY, targetEntity = User.class)
	private List<User> otherOwners;
	
	@ManyToOne(fetch = FetchType.LAZY, targetEntity = User.class)
	private User createdBy;
	
	@PrePersist
	void createdAt() {
		this.createdAt = new Date();
	}
	
	public Group(String name, String description, String type, String semesterTerm, int semesterYear, List<User> members, List<User> otherOwners, User createdBy) {
		this.name = name;
		this.description = description;
		this.type = type;
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
