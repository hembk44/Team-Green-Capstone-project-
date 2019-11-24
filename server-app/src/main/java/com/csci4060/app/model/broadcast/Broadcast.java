package com.csci4060.app.model.broadcast;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

@Entity
@Data
public class Broadcast {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	long id;
	
	@NotEmpty(message= "Image must not be empty!")
	String image;
	
	public Broadcast(String image) {
		this.image = image;
	}
}
