package com.csci4060.app.model.calendar;

import java.util.List;

import com.csci4060.app.model.event.Event;

import lombok.Data;

@Data
public class CalendarResponse {

	private long id;
	private String name;
	private List<Event> events;
	private String createdBy;
	private boolean shown;
	private boolean isDefaultCalendar;

	public CalendarResponse(long id, String name, List<Event> events, String createdBy,
			boolean shown, boolean isDefaultCalendar) {
		super();
		this.id = id;
		this.name = name;
		this.events = events;
		this.createdBy = createdBy;
		this.shown = shown;
		this.isDefaultCalendar = isDefaultCalendar;
	}

	public CalendarResponse() {
		super();
	}
	
	

}
