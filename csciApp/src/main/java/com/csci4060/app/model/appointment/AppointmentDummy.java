package com.csci4060.app.model.appointment;

import java.util.List;

import lombok.Data;

@Data
public class AppointmentDummy {

	String name;
	String description;
	List<AppointmentDate> appdates;
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
