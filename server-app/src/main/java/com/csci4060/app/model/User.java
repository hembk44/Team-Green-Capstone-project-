package com.csci4060.app.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.hibernate.annotations.NaturalId;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class User{

	@JsonIgnore
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty(message="Name must not be empty!")
	private String name;
	
	@JsonIgnore
	@NotEmpty(message="Username must not be empty!")
	private String username;
	
	//What naturally identifies an entity. This improves performance during lookup
	@NaturalId
	@NotEmpty(message= "Email must not be empty")
	private String email;
	
	@NotEmpty(message="Password must not be empty")
	@JsonIgnore
	private String password;
	
	@JsonIgnore
	private boolean verified;
	
//	//Loads the roles of user only when needed i.e user.getRoles
	@JsonIgnore
	@ManyToMany(targetEntity = Role.class)
	private Set<Role> roles = new HashSet<>();
	
	public User() {
		
	}
	
	public User(String name, String username, String email, String password, boolean verified) {
		this.name = name;
		this.username = username;
		this.email = email;
		this.password = password;
		this.verified = verified;
	}

	
}