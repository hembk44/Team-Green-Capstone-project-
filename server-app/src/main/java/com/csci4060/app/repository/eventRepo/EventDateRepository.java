package com.csci4060.app.repository.eventRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.event.EventDate;

public interface EventDateRepository extends JpaRepository<EventDate, Long>{

}
