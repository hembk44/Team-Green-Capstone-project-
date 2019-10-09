package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.event.EventDate;
import com.csci4060.app.repository.event.EventDateRepository;
import com.csci4060.app.services.EventDateService;

@Service(value = "eventDateService")
public class EventDateServiceImpl implements EventDateService {

	@Autowired
	EventDateRepository eventDateRepo;
	
	@Override
	public EventDate save(EventDate eventDate) {
		return eventDateRepo.save(eventDate);
	}

}
