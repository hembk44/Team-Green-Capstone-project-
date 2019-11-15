package com.csci4060.app.model.calendar;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
<<<<<<< HEAD

import javax.validation.constraints.NotEmpty;


=======
import javax.validation.constraints.NotEmpty;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
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
	
	@NotEmpty(message= "Calendar name must not be empty!")
	String name;
	
<<<<<<< HEAD

	
	String color;
	

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	@ManyToMany(targetEntity = Event.class, fetch = FetchType.LAZY)
	List<Event> events;
	
	@JsonIgnore
	@ManyToMany(targetEntity = User.class)
	List<User> shareduser;
	
	@JsonIgnore
	@ManyToOne(targetEntity = User.class)
	User createdBy;
	
	boolean shown;
	
	boolean isDefaultCalendar;
	
	public void addEvent(Event event) {
		events.add(event);
		//event.getCalendars().add(this);
	}
	
	public void removeEvent(Event event) {
        events.remove(event);
        //event.getCalendars().remove(this);
    }
	
<<<<<<< HEAD

	public Calendar(String name, String color, List<Event> events, List<User> shareduser, User createdBy, boolean shown, boolean isDefaultCalendar) {
		this.name = name;
		this.color = color;
=======
	public Calendar(String name, List<Event> events, List<User> shareduser, User createdBy, boolean shown, boolean isDefaultCalendar) {
		this.name = name;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
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
