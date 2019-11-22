package com.csci4060.app.model.appointment;

import java.util.List;

import com.csci4060.app.model.User;

public class DateAndTimeSlotResponse {
	
	private String date;
	private List<TimeSlotResponse> response;
	private String location;
	
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public List<TimeSlotResponse> getResponse() {
		return response;
	}
	public void setResponse(List<TimeSlotResponse> response) {
		this.response = response;
	}
	
	
	public DateAndTimeSlotResponse() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	public DateAndTimeSlotResponse(String date, List<TimeSlotResponse> response, String location) {
		super();
		this.date = date;
		this.response = response;
		this.location = location;
	}
	
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	
	
	
	
	
	

}
