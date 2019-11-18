package com.csci4060.app.model.calendar;

import java.util.List;

import com.csci4060.app.model.event.Event;
import com.csci4060.app.model.group.MemberNameAndEmail;

import lombok.Data;

@Data
public class CalendarResponse {

	private long id;
	private String name;
	private String color;
	private List<Event> events;
	private String createdBy;
	private List<MemberNameAndEmail> recipients;
	private boolean shown;
	private boolean isDefaultCalendar;

	public CalendarResponse(long id, String name, String color, List<Event> events, String createdBy, List<MemberNameAndEmail> recipients,
			boolean shown, boolean isDefaultCalendar) {
		super();
		this.id = id;
		this.name = name;
		this.color = color;
		this.events = events;
		this.createdBy = createdBy;
		this.recipients = recipients;
		this.shown = shown;
		this.isDefaultCalendar = isDefaultCalendar;
	}

	public CalendarResponse() {
		super();
	}
	
	

}
