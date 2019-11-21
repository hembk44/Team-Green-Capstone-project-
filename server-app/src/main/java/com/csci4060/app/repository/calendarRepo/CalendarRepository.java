package com.csci4060.app.repository.calendarRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.model.event.Event;

public interface CalendarRepository extends JpaRepository<Calendar, Long>{

	Optional<List<Calendar>> findAllByCreatedBy(User user);
	
	Optional<List<Calendar>> findAllByShareduser(User user);
	
	Optional<Calendar> findByNameAndCreatedBy(String name, User user);
	
	Optional<List<Calendar>> findAllByEvents(Event event);
	
	void delete(Calendar calendar);
}
