package com.csci4060.app.model.event;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class EventDummy {
	
	@NotNull(message= " Host Calendar must be specified for this event")
	Long calendarId;
	
	@NotEmpty(message= "Event title must not be empty")
	String title;
	
	String description;
	
	@NotEmpty(message= "Location must be specified for the event")
	String location;
	
	List<String> recipients;
	
	String start;
	String end;
	Boolean allDay;
	String borderColor;
	String backgroundColor;
}
