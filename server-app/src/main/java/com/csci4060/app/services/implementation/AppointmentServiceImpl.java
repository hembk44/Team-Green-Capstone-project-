package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.repository.appointmentRepo.AppointmentRepository;
import com.csci4060.app.services.AppointmentService;

@Service(value = "appointmentService")
public class AppointmentServiceImpl implements AppointmentService {

	@Autowired
	AppointmentRepository appointmentRepo;

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

}
