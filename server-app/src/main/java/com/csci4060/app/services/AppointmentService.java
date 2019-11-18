package com.csci4060.app.services;

import java.util.List;
import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;

public interface AppointmentService {

	Appointment save(Appointment appointment);
	
	List<Appointment> findAllByRecepients(User user);
	
	List<Appointment> findAllByCreatedBy(User user);
	
	Appointment findById(Long id);
	
	void delete(Appointment appointment);
}
