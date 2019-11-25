package com.csci4060.app.model.event;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

import com.csci4060.app.model.User;
import lombok.Data;

@Data
@Entity
public class Event{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotNull(message="Event must have a title!!")
	String title;
	
	String description;
	
	String location;

	@ManyToMany(targetEntity = User.class)
	List<User> recipients;

	@ManyToMany(targetEntity =  User.class)
	List<User> confirmedBy; 
	
	
	@NotNull(message="Start time must be specified while creating an event!")
	String start;
	
	@NotNull(message="End time must be specified while creating an event!")
	String end;
	
	@OneToOne(targetEntity = User.class)
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
