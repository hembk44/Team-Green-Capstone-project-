package com.csci4060.app.model.event;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Entity
@Table(name="eventdates")
public class EventDate {
	
	@JsonIgnore
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String date;
	
	@OneToMany(targetEntity = EventTime.class, cascade = CascadeType.ALL)
	private List<EventTime> eventtimes;
	
	public EventDate(String date, List<EventTime> times) {
		this.date = date;
		this.eventtimes = times;
	}

	public EventDate() {
		super();
	}
	
	
}
