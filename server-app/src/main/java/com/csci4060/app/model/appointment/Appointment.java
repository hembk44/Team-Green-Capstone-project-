package com.csci4060.app.model.appointment;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.csci4060.app.model.User;
import lombok.Data;

@Data
@Entity
public class Appointment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	
	String name;
	
	String description;

	@OneToMany(targetEntity = AppointmentDate.class)
	List<AppointmentDate> appdates;

	@ManyToMany(targetEntity = User.class)
	List<User> recepients;
	
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
