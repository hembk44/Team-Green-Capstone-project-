package com.csci4060.app.model.calendar;

import java.util.List;


import javax.validation.constraints.NotEmpty;


import lombok.Data;

@Data
public class CalendarCreate {


	@NotEmpty(message= "Calendar name must not be emtpy")
	String name;
	String color;
	List<String> recipients;
}
