package com.csci4060.app.model.calendar;

import java.util.List;

import lombok.Data;

@Data
public class CalendarCreate {

	String name;
	List<String> recipients;
}
