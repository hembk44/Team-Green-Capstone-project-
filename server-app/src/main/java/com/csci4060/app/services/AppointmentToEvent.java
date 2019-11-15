package com.csci4060.app.services;

import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.event.Event;

public interface AppointmentToEvent {

	Event covertToEvent(Appointment appointment);
}
