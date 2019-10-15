package com.csci4060.app.model.calendar;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
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
	
	@ManyToMany(targetEntity = Event.class, fetch = FetchType.LAZY)
	@JoinTable(name = "calendar_events",
				joinColumns = {@JoinColumn(name = "calendar_id")},
				inverseJoinColumns = {@JoinColumn(name = "events_id")})
	List<Event> events;
	
	@JsonIgnore
	@ManyToMany(targetEntity = User.class)
	List<User> shareduser;
	
	@JsonIgnore
	@ManyToOne(targetEntity = User.class)
	User createdBy;
	
	boolean shown;
	
	boolean isDefaultCalendar;
	
	public Calendar(String name, List<Event> events, List<User> shareduser, User createdBy, boolean shown, boolean isDefaultCalendar) {
		this.name = name;
		this.events = events;
		this.shareduser = shareduser;
		this.createdBy = createdBy;
		this.shown = shown;
		this.isDefaultCalendar = isDefaultCalendar;
	}

	public Calendar() {
		super();
	}
}
