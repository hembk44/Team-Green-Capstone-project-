package com.csci4060.app.model.event;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class EventEdit {
	
	@NotNull(message= " Host Calendar must be specified for this event")
	Long calendarId;
	
	@NotEmpty(message="Name must not be empty")
	String title;
	
	String description;
	
	List<String> recipients;
	
	@NotEmpty(message= "Location must be specified for the event")
	String location;
	
	@NotEmpty(message= "Start time must be specified for the event!")
	String start;
	
	@NotEmpty(message= "End time must be specified for the event!")
	String end;
	
	Boolean allDay;
	String borderColor;
	String backgroundColor;
}
