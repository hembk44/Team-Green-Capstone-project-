package com.csci4060.app.repository.eventRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.event.EventTime;

public interface EventTimesRepository extends JpaRepository<EventTime, Long>{

}
