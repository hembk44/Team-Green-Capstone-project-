package com.csci4060.app.model.event;

import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class EventDummy {
	Long calendarId;
	String title;
	String description;
	String location;
	List<String> recipients;
	String start;
	String end;
	Boolean allDay;
	String borderColor;
	String backgroundColor;
}
