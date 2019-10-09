package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.event.EventTime;
import com.csci4060.app.repository.event.EventTimesRepository;
import com.csci4060.app.services.EventTimeService;

@Service(value = "eventTimeService")
public class EventTimeServiceImpl implements EventTimeService {

	@Autowired
	EventTimesRepository eventTimeRepo;
	
	@Override
	public EventTime save(EventTime eventTime) {
		return eventTimeRepo.save(eventTime);
	}

}
