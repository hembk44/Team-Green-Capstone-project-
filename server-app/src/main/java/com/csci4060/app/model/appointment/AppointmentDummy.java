package com.csci4060.app.model.appointment;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class AppointmentDummy {

	
	@NotEmpty(message="Name must not be empty")
	String name;
	
	String description;
	
	//validation for @NotNull is needed
	List<@NotNull AppointmentDate> appdates;
	
	
	List<String> recepients;
	
	String location;
	
	public AppointmentDummy(String name, String description, List<AppointmentDate> dates, List<String> recepients, String location) {
		this.name = name;
		this.description = description;
		this.appdates = dates;
		this.recepients = recepients;
		this.location = location;
	}
	
}
