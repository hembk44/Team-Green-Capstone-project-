package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.AppointmentDate;
import com.csci4060.app.model.appointment.TimeSlots;
import com.csci4060.app.repository.appointmentRepo.AppointmentRepository;
import com.csci4060.app.services.AppointmentDateService;
import com.csci4060.app.services.AppointmentService;
import com.csci4060.app.services.TimeSlotsService;

@Service(value = "appointmentService")
public class AppointmentServiceImpl implements AppointmentService {

	@Autowired
	AppointmentRepository appointmentRepo;

	@Autowired
	TimeSlotsService timeSlotsService;
	
	@Autowired
	AppointmentDateService appointmentDateService;
	
	@Override
	public Appointment save(Appointment appointment) {
		return appointmentRepo.save(appointment);
	}

	@Override
	public List<Appointment> findAllByRecepients(User user) {

		Optional<List<Appointment>> optAppointments = appointmentRepo.findAllByRecepients(user);

		if (optAppointments.isPresent()) {
			return optAppointments.get();
		}
		return null;
	}

	@Override
	public Appointment findById(Long id) {

		Optional<Appointment> optAppointment = appointmentRepo.findById(id);

		if (optAppointment.isPresent()) {
			return optAppointment.get();
		}
		return null;
	}

	@Override
	public List<Appointment> findAllByCreatedBy(User user) {

		Optional<List<Appointment>> optAppointments = appointmentRepo.findAllByCreatedBy(user);

		if (optAppointments.isPresent()) {
			return optAppointments.get();
		}
		return null;
	}

	@Override
	public void delete(Appointment appointment) {
		
		List<TimeSlots> timeSlots = timeSlotsService.findAllByAppointment(appointment);
				
		for(TimeSlots slots: timeSlots) {
			timeSlotsService.delete(slots);
		}
		
		List<AppointmentDate> appointmentDates = new CopyOnWriteArrayList<AppointmentDate>();
		
		List<AppointmentDate> appDates = appointment.getAppdates();
		
		for(AppointmentDate date: appDates) {
			appointmentDates.add(date);
		}
		
		for(AppointmentDate date: appointmentDates) {
			appointment.getAppdates().remove(date);
			appointmentDateService.delete(date);
		}
		
		appointment.getRecepients().clear();
		
		appointmentRepo.delete(appointment);
	}

}
