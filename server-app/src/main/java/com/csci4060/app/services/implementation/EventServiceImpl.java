package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.User;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.repository.eventRepo.EventRepository;
import com.csci4060.app.services.EventService;

@Service(value = "EventService")
public class EventServiceImpl implements EventService {

	@Autowired
	EventRepository eventRepo;

	@Override
	public Event save(Event Event) {
		return eventRepo.save(Event);
	}

	@Override
	public List<Event> findAllByRecepients(User user) {

		Optional<List<Event>> optEvents = eventRepo.findAllByRecipients(user);
		if (optEvents.isPresent()) {
			return optEvents.get();
		}
		return null;
	}

	@Override
	public Event findById(Long id) {

		Optional<Event> optEvent = eventRepo.findById(id);
		if (optEvent.isPresent()) {
			return optEvent.get();
		}
		return null;

	}

	@Override
	public List<Event> findAllByCreatedBy(User user) {

		Optional<List<Event>> optEvents = eventRepo.findAllByCreatedBy(user);
		if (optEvents.isPresent()) {
			return optEvents.get();
		}
		return null;
	}

	@Override
	public Event findByTimeSlotId(Long timeSlotId) {
		Optional<Event> optEvent = eventRepo.findByTimeSlotId(timeSlotId);
		if (optEvent.isPresent()) {
			return optEvent.get();
		}
		return null;
	}

}
