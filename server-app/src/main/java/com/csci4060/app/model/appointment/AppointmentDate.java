package com.csci4060.app.model.appointment;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
@Table(name="appdates")
public class AppointmentDate {
	
	@JsonIgnore
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String date;
	
	@OneToMany(targetEntity = AppointmentTime.class)
	private List<AppointmentTime> apptimes;
	
	public AppointmentDate(String date, List<AppointmentTime> times) {
		this.date = date;
		this.apptimes = times;
	}

	public AppointmentDate() {
		super();
	}
	
	
}
