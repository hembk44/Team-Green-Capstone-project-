package com.csci4060.app.model.calendar;

import java.util.List;

import com.csci4060.app.model.event.Event;

import lombok.Data;

@Data
public class CalendarResponse {

	private long id;
	private String name;
<<<<<<< HEAD

	private String color;

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	private List<Event> events;
	private String createdBy;
	private boolean shown;
	private boolean isDefaultCalendar;

<<<<<<< HEAD

	public CalendarResponse(long id, String name, String color, List<Event> events, String createdBy,
=======
	public CalendarResponse(long id, String name, List<Event> events, String createdBy,
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
			boolean shown, boolean isDefaultCalendar) {
		super();
		this.id = id;
		this.name = name;
<<<<<<< HEAD
		this.color = color;
=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
		this.events = events;
		this.createdBy = createdBy;
		this.shown = shown;
		this.isDefaultCalendar = isDefaultCalendar;
	}

	public CalendarResponse() {
		super();
	}
	
	

}
