package com.csci4060.app.repository.eventRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.event.Event;

public interface EventRepository extends JpaRepository<Event,Long>{

	Optional<List<Event>> findAllByRecipients(User user);
	
	Optional<List<Event>> findAllByCreatedBy(User createdBy);
	
	Optional<Event> findById(Long id);
	
	Optional<Event> findByTimeSlotId(Long timeSlotId);
	
	void delete(Event event);
}
