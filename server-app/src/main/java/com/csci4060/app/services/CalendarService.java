package com.csci4060.app.services;

import com.csci4060.app.model.calendar.Calendar;

public interface CalendarService {

	Calendar save(Calendar calendar);
	
	Calendar findById(Long id);
}
