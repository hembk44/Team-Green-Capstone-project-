package com.csci4060.app.model.event;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.csci4060.app.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class Event {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	String name;
	String description;

	@OneToMany(targetEntity = EventDate.class, cascade = CascadeType.ALL)
	List<EventDate> eventdates;

	@JsonIgnore
	@ManyToMany(targetEntity = User.class)
	List<User> recepients;
	
	@JsonIgnore
	@OneToOne(targetEntity = User.class)
	User createdBy;
	
	String location;
	
	public Event(String name, String description, List<EventDate> dates, List<User> recepients, User createdBy, String location) {
		this.name = name;
		this.description = description;
		this.eventdates = dates;
		this. recepients = recepients;
		this.createdBy = createdBy;
		this.location = location;
	}

	public Event(String name, String description, List<EventDate> dates, String location) {
		this.name = name;
		this.description = description;
		this.eventdates = dates;
		this.location = location;
	}

	public Event() {
		super();
	}
	
	
	
	
}
