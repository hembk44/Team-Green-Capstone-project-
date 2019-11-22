package com.csci4060.app.repository.appointmentRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.AppointmentDate;
import com.csci4060.app.model.appointment.TimeSlots;

public interface TimeSlotsRepository extends JpaRepository<TimeSlots, Long>{

	Optional<List<TimeSlots>> findAllByAppointment(Appointment appointment);
	Optional<List<TimeSlots>> findAllBySelectedBy(User selectedBy);
	Optional<List<TimeSlots>> findAllByAppdates(AppointmentDate date);
	
	void delete(TimeSlots timeslots);
}
