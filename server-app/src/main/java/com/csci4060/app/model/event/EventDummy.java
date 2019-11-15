package com.csci4060.app.model.event;

import java.util.List;

<<<<<<< HEAD
import javax.validation.constraints.NotEmpty;

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class EventDummy {
<<<<<<< HEAD
	
	@NotEmpty(message= " Host Calendar must be specified for this event")
	Long calendarId;
	
	@NotEmpty(message= "Event title must not be empty")
	String title;
	
	String description;
	
	@NotEmpty(message= "Location must be specified for the event")
=======
	Long calendarId;
	String title;
	String description;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	String location;
	List<String> recipients;
	String start;
	String end;
	Boolean allDay;
	String borderColor;
	String backgroundColor;
}
