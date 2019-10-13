package com.csci4060.app.repository.calendarRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.calendar.Calendar;

public interface CalendarRepository extends JpaRepository<Calendar, Long>{

	Calendar save(Calendar calendar);
}
