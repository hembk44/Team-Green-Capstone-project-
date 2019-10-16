package com.csci4060.app.services;

import java.util.List;

import com.csci4060.app.model.User;
import com.csci4060.app.model.event.Event;

public interface EventService {

	Event save(Event appointment);

	List<Event> findAllByRecepients(User user);

	List<Event> findAllByCreatedBy(User user);

	Event findById(Long id);
	
	Event findByTimeSlotId(Long timeSlotId);
}
