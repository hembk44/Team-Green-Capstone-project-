package com.csci4060.app.model.appointment;

import java.time.LocalTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.csci4060.app.model.User;
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
	
	@JsonIgnore
	@ManyToOne(targetEntity = AppointmentDate.class)
	private AppointmentDate appdates;
	
	@ManyToOne(targetEntity = Appointment.class)
	private Appointment appointment;
	
	@OneToOne(targetEntity = User.class)
	private User selectedBy;
	
	public TimeSlots(LocalTime startTime, LocalTime endTime, AppointmentDate date, Appointment appointment, User selectedBy) {
		this.startTime = startTime;
		this.endTime = endTime;
		this.appdates = date;
		this.appointment = appointment;
		this.selectedBy = selectedBy;
	}

	public TimeSlots() {
		super();
	}
	
	
}
