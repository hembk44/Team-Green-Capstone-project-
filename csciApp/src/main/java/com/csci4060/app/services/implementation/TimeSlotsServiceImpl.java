package com.csci4060.app.services.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.TimeSlots;
import com.csci4060.app.repository.appointmentRepo.TimeSlotsRepository;
import com.csci4060.app.services.TimeSlotsService;

@Service(value = "timeSlotsService")
public class TimeSlotsServiceImpl implements TimeSlotsService {

	@Autowired
	TimeSlotsRepository timeSlotsRepo;

	@Override
	public TimeSlots save(TimeSlots slots) {
		return timeSlotsRepo.save(slots);
	}

	@Override
	public List<TimeSlots> findByAppointment(Appointment appointment) {
		return timeSlotsRepo.findByAppointment(appointment);
	}

	@Override
	public TimeSlots findById(Long id) {
		return timeSlotsRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Slot with given id not find."));
	}

}
