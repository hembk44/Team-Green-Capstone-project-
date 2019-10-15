package com.csci4060.app.repository.calendarRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.calendar.Calendar;

public interface CalendarRepository extends JpaRepository<Calendar, Long>{

	Optional<List<Calendar>> findAllByCreatedBy(User user);
	
	Optional<List<Calendar>> findAllByShareduser(User user);
}
