package com.csci4060.app.services.implementation;

import java.util.List;
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
		return appointmentRepo.findAllByRecepients(user)
				.orElseThrow(() -> new RuntimeException("Fail! -> This user does not have any appointments."));
	}

	@Override
	public Appointment findById(Long id) {
		return appointmentRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Appointment with the given ID not find."));
	}

	@Override
	public List<Appointment> findAllByCreatedBy(User user) {
		return appointmentRepo.findAllByCreatedBy(user)
				.orElseThrow(() -> new RuntimeException("Fail! -> This user has not created any appointments."));
	}

}
