package com.csci4060.app.model.appointment;

import java.util.List;

import com.csci4060.app.model.User;

public class ResponseWithPendingUser {
private List<DateAndTimeSlotResponse> response;
private List<User> pendingUsers;





public List<DateAndTimeSlotResponse> getResponse() {
	return response;
}
public void setResponse(List<DateAndTimeSlotResponse> response) {
	this.response = response;
}
public List<User> getPendingUsers() {
	return pendingUsers;
}
public void setPendingUsers(List<User> pendingUsers) {
	this.pendingUsers = pendingUsers;
}




public ResponseWithPendingUser(List<DateAndTimeSlotResponse> response2, List<User> pendingUsers) {
	super();
	this.response = response2;
	this.pendingUsers = pendingUsers;
	
}
public ResponseWithPendingUser() {
	super();
	// TODO Auto-generated constructor stub
}



}
