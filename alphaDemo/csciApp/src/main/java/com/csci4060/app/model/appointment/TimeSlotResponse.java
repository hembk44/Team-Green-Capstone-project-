package com.csci4060.app.model.appointment;

import java.time.LocalTime;

import lombok.Data;

@Data
public class TimeSlotResponse {

	private Long id;
	private LocalTime startTime;
	private LocalTime endTime;
	private String date;
	private String selectorName;
	private String selectorEmail;
	
	public TimeSlotResponse(Long id, LocalTime startTime, LocalTime endTime, String date, String selectorName, String selectorEmail) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
		this.selectorName = selectorName;
		this.selectorEmail = selectorEmail;
	}

	public TimeSlotResponse() {
		super();
	}

	public TimeSlotResponse(Long id, LocalTime startTime, LocalTime endTime, String date) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
	}
	
	
	
}
