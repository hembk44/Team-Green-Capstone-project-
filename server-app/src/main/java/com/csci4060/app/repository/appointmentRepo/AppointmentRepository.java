package com.csci4060.app.repository.appointmentRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.AppointmentDate;

public interface AppointmentRepository extends JpaRepository<Appointment,Long>{

	Optional<List<Appointment>> findAllByRecepients(User user);
	
	Optional<List<Appointment>> findAllByCreatedBy(User createdBy);
	
	Optional<Appointment> findById(Long id);
	
	Optional<List<AppointmentDate>> findAllAppdatesById(Appointment app);
	
	void delete(Appointment appointment);
}
