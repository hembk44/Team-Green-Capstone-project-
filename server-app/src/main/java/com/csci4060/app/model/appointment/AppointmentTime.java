package com.csci4060.app.model.appointment;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

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
	
	@NotNull(message="Start Time must be specified")
	private String startTime;
	
	@NotNull(message="End Time must be specified")
	private String endTime;
	
	@NotNull(message=" Span of appointments must be specified")
	private int interv;

}
