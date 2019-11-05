package com.csci4060.app.model.group;

import java.util.List;

import lombok.Data;

@Data
public class GroupResponse {

	private String name;
	private String description;
	private List<MemberNameAndEmail> nameAndEmails;
	
	public GroupResponse(String name, String description, List<MemberNameAndEmail> nameAndEmails) {
		super();
		this.name = name;
		this.description = description;
		this.nameAndEmails = nameAndEmails;
	}
	
	
}
