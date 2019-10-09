package com.csci4060.app.services;

import java.util.List;
import java.util.Optional;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.TimeSlots;

public interface TimeSlotsService {

	TimeSlots save(TimeSlots slots);
	
	List<TimeSlots> findByAppointment(Appointment appointment);
	
	TimeSlots findById(Long id);
	List<TimeSlots> findBySelectedBy(User selectedBy);
 
}
