package com.csci4060.app.repository.appointmentRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.TimeSlots;

public interface TimeSlotsRepository extends JpaRepository<TimeSlots, Long>{

	Optional<List<TimeSlots>> findByAppointment(Appointment appointment);
	Optional<List<TimeSlots>> findBySelectedBy(User selectedBy);
}
