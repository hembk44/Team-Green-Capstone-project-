package com.csci4060.app.model.appointment;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
@Table(name="apptimes")
public class AppointmentTime {
	
	@JsonIgnore
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotEmpty(message="Start Time must be specified")
	private String startTime;
	
	@NotEmpty(message="End Time must be specified")
	private String endTime;
	
	@NotEmpty(message="Interval must be specified")
	private int interv;

}
