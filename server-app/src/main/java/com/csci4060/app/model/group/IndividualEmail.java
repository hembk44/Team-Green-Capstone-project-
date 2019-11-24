package com.csci4060.app.model.group;

import java.util.List;

import lombok.Data;

@Data
public class IndividualEmail {

	List<String> recipients;
	String title;
	String message;
}
