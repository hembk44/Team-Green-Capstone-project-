package com.csci4060.app.model.appointment;

import java.util.List;

import lombok.Data;

@Data
public class AppointmentDummy {

	String name;
	String description;
	List<AppointmentDate> dates;
	List<String> recepients;
	
	public AppointmentDummy(String name, String description, List<AppointmentDate> dates) {
		this.name = name;
		this.description = description;
		this.dates = dates;
	}
	
}
