package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.repository.appointmentRepo.AppointmentRepository;
import com.csci4060.app.services.AppointmentService;

@Service(value = "appointmentService")
public class AppointmentServiceImpl implements AppointmentService{

	@Autowired
	AppointmentRepository appointmentRepo;
	
	@Override
	public Appointment save(Appointment appointment) {
		return appointmentRepo.save(appointment);
	}

	
}
