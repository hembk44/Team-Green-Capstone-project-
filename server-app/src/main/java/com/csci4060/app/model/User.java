package com.csci4060.app.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.hibernate.annotations.NaturalId;

import com.csci4060.app.model.calendar.Calendar;

import lombok.Data;

@Data
@Entity
public class User {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty(message="Name must not be empty!")
	@Size(min=3, max=50)
	private String name;
	
	@NotEmpty(message="Username must not be empty!")
	@Size(max=50)
	private String username;
	
	//What naturally identifies an entity. This improves performance during lookup
	@NaturalId
	@Size(min=6, max=100)
	@Email(message= "Email is not valid!")
	private String email;
	
	@NotEmpty(message="Password must not be empty")
	@Size(min=6, max=100 , message = "Password must be minimum of 6 characters")
	private String password;
	
	private boolean verified;
	
//	//Loads the roles of user only when needed i.e user.getRoles
	@ManyToMany(fetch = FetchType.LAZY, targetEntity = Role.class)
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
