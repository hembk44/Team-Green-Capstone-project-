package com.csci4060.app.repository.event;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.event.Event;

public interface EventRepository extends JpaRepository<Event,Long>{

	Optional<List<Event>> findAllByRecepients(User user);
	
	Optional<List<Event>> findAllByCreatedBy(User createdBy);
	
	Optional<Event> findById(Long id);
}
