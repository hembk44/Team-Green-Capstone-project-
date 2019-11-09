package com.csci4060.app.model.appointment;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import com.csci4060.app.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class Appointment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotEmpty(message="Appointment name must not be empty!")
	String name;
	
	String description;

	@OneToMany(targetEntity = AppointmentDate.class, cascade = CascadeType.ALL)
	List<AppointmentDate> appdates;

	@JsonIgnore
	@ManyToMany(targetEntity = User.class)
	List<@Email User> recepients;
	
	@JsonIgnore
	@OneToOne(targetEntity = User.class)
	User createdBy;
	
	String location;
	
	public Appointment(String name, String description, List<AppointmentDate> dates, List<User> recepients, User createdBy, String location) {
		this.name = name;
		this.description = description;
		this.appdates = dates;
		this. recepients = recepients;
		this.createdBy = createdBy;
		this.location = location;
	}

	public Appointment(String name, String description, List<AppointmentDate> dates, String location) {
		this.name = name;
		this.description = description;
		this.appdates = dates;
		this.location = location;
	}

	public Appointment() {
		super();
	}
	
	
	
	
}
