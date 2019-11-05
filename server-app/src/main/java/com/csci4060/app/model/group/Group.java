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
import com.fasterxml.jackson.annotation.JsonIgnore;

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
	
	private String description;
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY, targetEntity = User.class)
	private List<User> recipients;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY, targetEntity = User.class)
	private User createdBy;
	
	private Date createdAt;
	
	@PrePersist
	void createdAt() {
		this.createdAt = new Date();
	}
	
	public Group(String name, String description, List<User> recipients, User createdBy) {
		this.name = name;
		this.description = description;
		this.recipients = recipients;
		this.createdBy = createdBy;
	}

	public Group() {
		super();
	}
	
}
