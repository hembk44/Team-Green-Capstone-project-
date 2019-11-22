package com.csci4060.app.model.appointment;

import java.util.List;

import com.csci4060.app.model.User;

public class DateAndTimeSlotResponse {
	
	private String date;
	private List<TimeSlotResponse> response;
	private List<User> pendingUsers;
	
	
	public DateAndTimeSlotResponse(String date, List<TimeSlotResponse> response, List<User> pendingUsers) {
		super();
		this.date = date;
		this.response = response;
		this.pendingUsers = pendingUsers;
	}
	
	
	
	public List<User> getPendingUsers() {
		return pendingUsers;
	}
	public void setPendingUsers(List<User> pendingUsers) {
		this.pendingUsers = pendingUsers;
	}
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
	
	
	public DateAndTimeSlotResponse(String date, List<TimeSlotResponse> response) {
		super();
		this.date = date;
		this.response = response;
	}
	
	
	
	
	
	

}
