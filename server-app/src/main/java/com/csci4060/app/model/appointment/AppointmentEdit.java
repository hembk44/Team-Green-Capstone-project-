package com.csci4060.app.model.appointment;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import lombok.Data;

@Data
public class AppointmentEdit {

	@NotEmpty(message="Name must not be empty")
	String name;
	
	String description;
	
	List<String> recepients;
	
	String location;
}
