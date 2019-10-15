package com.csci4060.app.services.implementation;

import java.util.List;

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
		return eventRepo.findAllByRecipients(user)
				.orElseThrow(() -> new RuntimeException("Fail! -> This user does not have any Events."));
	}

	@Override
	public Event findById(Long id) {
		return eventRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Event with the given ID not find."));
	}

	@Override
	public List<Event> findAllByCreatedBy(User user) {
		return eventRepo.findAllByCreatedBy(user)
				.orElseThrow(() -> new RuntimeException("Fail! -> This user has not created any Events."));
	}

}
