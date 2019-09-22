package com.csci4060.app.model.appointment;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name="Dates")
public class AppointmentDate {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String date;
	
	@OneToMany(targetEntity = AppointmentTime.class, mappedBy = "date")
	private List<AppointmentTime> times;
	
	@OneToMany(targetEntity = TimeSlots.class, mappedBy = "date")
	private List<TimeSlots> slots;
	
	@ManyToOne
	private Appointment appointment;
}
