package com.csci4060.app.model.calendar;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

import com.csci4060.app.model.User;
import com.csci4060.app.model.event.Event;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class Calendar {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	long id;
	
	@NotNull
	String name;
	
	@OneToMany(targetEntity = Event.class, cascade = CascadeType.ALL)
	List<Event> events;
	
	@JsonIgnore
	@ManyToMany(targetEntity = User.class)
	List<User> shareduser;
	
	@ManyToOne(targetEntity = User.class)
	User createdBy;
	
	boolean shown;
	
	boolean isDefault;
	
	public Calendar(String name, List<Event> events, List<User> shareduser, User createdBy, boolean shown, boolean isDefault) {
		this.name = name;
		this.events = events;
		this.shareduser = shareduser;
		this.createdBy = createdBy;
		this.shown = shown;
		this.isDefault = isDefault;
	}

	public Calendar() {
		super();
	}
}
