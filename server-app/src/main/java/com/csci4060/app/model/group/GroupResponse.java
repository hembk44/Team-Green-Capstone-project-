package com.csci4060.app.model.group;

import java.util.List;

import lombok.Data;

@Data
public class GroupResponse {

	private String name;
	private String description;
	private String type;
	private String semester;
	private List<MemberNameAndEmail> members;
	
	public GroupResponse(String name, String description, String type, String semester, List<MemberNameAndEmail> members) {
		super();
		this.name = name;
		this.description = description;
		this.type = type;
		this.semester = semester;
		this.members = members;
	}
	
	
}
