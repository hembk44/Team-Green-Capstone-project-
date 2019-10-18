package com.csci4060.app.model.appointment;

import lombok.Data;

@Data
public class TimeSlotResponse {

	private Long id;
	private String startTime;
	private String endTime;
	private String date;
	
	private String selectorName;
	private String selectorEmail;
	private String appointmentName;
	private String appointmentDescription;
	private String appointmentCreatorName;
	

	public TimeSlotResponse(Long id, String startTime, String endTime, String date, String selectorName, String selectorEmail, String name, String desc, String creatorName) {

		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
		this.selectorName = selectorName;
		this.selectorEmail = selectorEmail;
		this.appointmentName = name;
		this.appointmentDescription = desc;
		this.appointmentCreatorName = creatorName;
	}
	

	public TimeSlotResponse() {
		super();
	}

	public TimeSlotResponse(Long id, String startTime, String endTime, String date) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
		
	}

	public TimeSlotResponse(String startTime, String endTime, String date, String appointmentName,
			String appointmentDescription, String appointmentCreator) {
		super();
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
		this.appointmentName = appointmentName;
		this.appointmentDescription = appointmentDescription;
		this.appointmentCreatorName = appointmentCreator;
	}




	public TimeSlotResponse(Long id, String startTime, String endTime, String date, String selectorName,
			String selectorEmail) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
		this.selectorName = selectorName;
		this.selectorEmail = selectorEmail;
	}
	
	public TimeSlotResponse(Long id, String startTime, String endTime, String date, String appointmentName, String appointmentDescription, String appointmentCreator) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
		this.appointmentName = appointmentName;
		this.appointmentDescription = appointmentDescription;
		this.appointmentCreatorName = appointmentCreator;
	}
	
	
	
}
