package com.csci4060.app.repository.appointmentRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment,Long>{

	List<Appointment> findAllByRecepients(User user);
	List<Appointment> findAllByCreatedBy(User createdBy);
	
	Optional<Appointment> findById(Long id);
}
