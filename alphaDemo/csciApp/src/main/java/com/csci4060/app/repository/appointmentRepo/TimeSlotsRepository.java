package com.csci4060.app.repository.appointmentRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.TimeSlots;

public interface TimeSlotsRepository extends JpaRepository<TimeSlots, Long>{

	List<TimeSlots> findByAppointment(Appointment appointment);
}
