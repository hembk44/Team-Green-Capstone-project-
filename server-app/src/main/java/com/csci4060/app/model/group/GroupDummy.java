package com.csci4060.app.model.group;

import java.util.List;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class GroupDummy {

	@NotBlank
	private String name;
	
	private String description;
	
	@NotBlank
	private String type;
	
	@NotBlank
	private String semesterTerm;
	
	private int semesterYear;
	
	private List<String> recipients;
	
}
