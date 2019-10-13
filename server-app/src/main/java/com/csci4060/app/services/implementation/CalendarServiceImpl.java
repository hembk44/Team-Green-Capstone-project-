package com.csci4060.app.services.implementation;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.repository.calendarRepo.CalendarRepository;
import com.csci4060.app.services.CalendarService;

@Service(value = "calendarService")
public class CalendarServiceImpl implements CalendarService{

	@Autowired
	CalendarRepository calendarRepo;
	
	@Override
	public Calendar save(Calendar calendar) {
		return calendarRepo.save(calendar);
	}

	@Override
	public Calendar findById(Long id) {
		
		Optional<Calendar> optCalendar = calendarRepo.findById(id);
		
		if(optCalendar.isPresent()) {
			return optCalendar.get();
		}
		return null;
	}

}
