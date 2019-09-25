package com.csci4060.app.model.appointment;

import java.time.LocalTime;
import java.util.List;

import javax.persistence.Id;

import lombok.Data;

@Data
public class TimeSlotResponse {

	private Long id;
	private LocalTime startTime;
	private LocalTime endTime;
	private String date;
	
	public TimeSlotResponse(Long id, LocalTime startTime, LocalTime endTime, String date) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.endTime = endTime;
		this.date = date;
	}

	public TimeSlotResponse() {
		super();
	}
	
	
	
}
