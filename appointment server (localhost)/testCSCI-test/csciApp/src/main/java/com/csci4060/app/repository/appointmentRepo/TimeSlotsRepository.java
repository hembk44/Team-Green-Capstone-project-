package com.csci4060.app.repository.appointmentRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.appointment.AppointmentTime;

public interface TimeSlotsRepository extends JpaRepository<AppointmentTime, Long>{

}
