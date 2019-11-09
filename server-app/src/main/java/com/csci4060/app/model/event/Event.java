package com.csci4060.app.model.event;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.csci4060.app.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class Event {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotEmpty(message= "Event name must not be empty")
	String title;
	
	String description;

	@NotEmpty(message= "Location must be specified")
	String location;

	@JsonIgnore
	@ManyToMany(targetEntity = User.class, fetch = FetchType.LAZY)
	List<User> recipients;
	
	@NotEmpty(message= "Start time must be specified for the event!")
	String start;
	
	@NotEmpty(message= "End time must be specified for the event!")
	String end;
	
	@JsonIgnore
	@OneToOne(targetEntity = User.class, fetch = FetchType.LAZY)
	User createdBy;
	
	Boolean allDay;
	
	
	String borderColor;
	
	String backgroundColor;
	
	Long timeSlotId;
	
	public Event(String title, String description, String location, List<User> recipients, String start, String end, User createdBy, Boolean allDay, String borderColor, String backgroundColor) {
		this.title = title;
		this.description = description;
		this.location = location;
		this. recipients = recipients;
		this.start = start;
		this.end = end;
		this.createdBy = createdBy;
		this.allDay = allDay;
		this.borderColor = borderColor;
		this.backgroundColor = backgroundColor;
	}

	public Event() {
		super();
	}

	public Event(String title, String description, String location, List<User> recipients,String start, String end, User createdBy, Boolean allDay, String borderColor,
			String backgroundColor, Long timeSlotId) {
		super();
		this.title = title;
		this.description = description;
		this.location = location;
		this.recipients = recipients;
		this.start = start;
		this.end = end;
		this.createdBy = createdBy;
		this.allDay = allDay;
		this.borderColor = borderColor;
		this.backgroundColor = backgroundColor;
		this.timeSlotId = timeSlotId;
	}
	
	
	
	
}
