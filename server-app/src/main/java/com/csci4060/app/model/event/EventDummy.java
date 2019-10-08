package com.csci4060.app.model.event;

import java.util.List;

import lombok.Data;

@Data
public class EventDummy {

	String name;
	String description;
	List<EventDate> eventdates;
	List<String> recepients;
	String location;
	
	public EventDummy(String name, String description, List<EventDate> dates, String location) {
		this.name = name;
		this.description = description;
		this.eventdates = dates;
		this.location = location;
	}
	
}
