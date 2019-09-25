package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.csci4060.app.model.appointment.AppointmentDate;
import com.csci4060.app.repository.appointmentRepo.DateRepository;
import com.csci4060.app.services.AppointmentDateService;


@Service(value = "appointmentDateService")
public class AppointmentDateServiceImpl implements AppointmentDateService{

	@Autowired
	DateRepository appointmentDateRepo;
	
	@Override
	public AppointmentDate save(AppointmentDate appointmentDate) {
		return appointmentDateRepo.save(appointmentDate);
	}

	
}