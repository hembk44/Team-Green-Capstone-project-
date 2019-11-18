package com.csci4060.app.services;

import com.csci4060.app.model.appointment.AppointmentDate;

public interface AppointmentDateService {

	AppointmentDate save(AppointmentDate appointmentDate);
	
	void delete(AppointmentDate appointmentDate);
}