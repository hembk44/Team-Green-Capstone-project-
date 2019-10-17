package com.csci4060.app.services.implementation;

import org.springframework.stereotype.Service;

import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.services.AppointmentToEvent;

@Service(value = "appointmentToEventService")
public class AppointmentToEventImpl implements AppointmentToEvent{

	@Override
	public Event covertToEvent(Appointment appointment) {
		return null;
	}

	
}
