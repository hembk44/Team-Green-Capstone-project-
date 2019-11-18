package com.csci4060.app.model.event;

import java.util.List;

import lombok.Data;

@Data
public class EventShare {
	Long eventId;
	List<String> recipients; 
}
