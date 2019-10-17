package com.csci4060.app.model.appointment;

import java.util.List;

import lombok.Data;

@Data
public class AppointmentResponse {
	private long id; 
	private String name; 
	private String description; 
	private List<String> date;
	
	
	
	public AppointmentResponse(long id, String name, String description, List<String> date) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.date = date;
	} 
	
	
	
	

}
