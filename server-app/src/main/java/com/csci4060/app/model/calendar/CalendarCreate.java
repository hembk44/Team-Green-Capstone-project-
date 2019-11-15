package com.csci4060.app.model.calendar;

import java.util.List;

<<<<<<< HEAD

import javax.validation.constraints.NotEmpty;


=======
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import lombok.Data;

@Data
public class CalendarCreate {

<<<<<<< HEAD

	@NotEmpty(message= "Calendar name must not be emtpy")
	String name;
	String color;
=======
	@NotEmpty(message= "Calendar name must not be emtpy")
	String name;
	
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	List<String> recipients;
}
