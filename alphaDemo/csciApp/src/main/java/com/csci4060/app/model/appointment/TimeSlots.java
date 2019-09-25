package com.csci4060.app.model.appointment;

import java.time.LocalTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
public class TimeSlots {

	@JsonIgnore
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private LocalTime startTime;
	private LocalTime endTime;
	private boolean isSelected;
	
	@ManyToOne(targetEntity = AppointmentDate.class)
	private AppointmentDate date;
	
	@JsonIgnore
	@ManyToOne(targetEntity = Appointment.class)
	private Appointment appointment;
	
	public TimeSlots(LocalTime startTime, LocalTime endTime, boolean isSelected, AppointmentDate date, Appointment appointment) {
		this.startTime = startTime;
		this.endTime = endTime;
		this.isSelected = isSelected;
		this.date = date;
		this.appointment = appointment;
	}

	public TimeSlots() {
		super();
	}
	
	
}
