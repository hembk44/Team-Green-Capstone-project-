package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.csci4060.app.model.appointment.AppointmentTime;
import com.csci4060.app.repository.appointmentRepo.AppointmentTimesRepository;
import com.csci4060.app.services.AppointmentTimeService;


@Service(value = "appointmentTimeService")
public class AppointmentTimeServiceImpl implements AppointmentTimeService{

	@Autowired
	AppointmentTimesRepository appointmentTimeRepo;
	
	@Override
	public AppointmentTime save(AppointmentTime appointmentTime) {
		return appointmentTimeRepo.save(appointmentTime);
	}

	
}