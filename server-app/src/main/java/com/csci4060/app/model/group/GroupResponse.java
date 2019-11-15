package com.csci4060.app.model.group;

import java.util.List;

import lombok.Data;

@Data
public class GroupResponse {

	private String name;
	private String description;
	private String type;
	private String semesterTerm;
	private int semesterYear;
	private List<MemberNameAndEmail> members;
	
	public GroupResponse(String name, String description, String type, String semesterTerm, int semesterYear, List<MemberNameAndEmail> members) {
		super();
		this.name = name;
		this.description = description;
		this.type = type;
		this.semesterTerm = semesterTerm;
		this.semesterYear = semesterYear;
		this.members = members;
	}
	
	
}
