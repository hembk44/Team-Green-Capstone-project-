package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.csci4060.app.model.appointment.AppointmentDate;
import com.csci4060.app.model.appointment.AppointmentTime;
import com.csci4060.app.repository.appointmentRepo.AppointmentDateRepository;
import com.csci4060.app.services.AppointmentDateService;
import com.csci4060.app.services.AppointmentTimeService;


@Service(value = "appointmentDateService")
public class AppointmentDateServiceImpl implements AppointmentDateService{

	@Autowired
	AppointmentDateRepository appointmentDateRepo;
	
	@Autowired
	AppointmentTimeService appointmentTimeService;
	
	@Override
	public AppointmentDate save(AppointmentDate appointmentDate) {
		return appointmentDateRepo.save(appointmentDate);
	}

	@Override
	public void delete(AppointmentDate appointmentDate) {
		
		List<AppointmentTime> appointmentTimes = new CopyOnWriteArrayList<AppointmentTime>();
		
		List<AppointmentTime> appTimes = appointmentDate.getApptimes();
		for(AppointmentTime times: appTimes) {
			appointmentTimes.add(times);
		}
		
		for(AppointmentTime time: appointmentTimes) {
			appointmentDate.getApptimes().remove(time);
			appointmentTimeService.delete(time);
		}
		appointmentDateRepo.delete(appointmentDate);
		
	}

	
}