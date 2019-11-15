package com.csci4060.app.model.group;

import lombok.Data;

@Data
public class MemberNameAndEmail {

	private String name;
	private String email;
	
	public MemberNameAndEmail(String name, String email) {
		this.name = name;
		this.email = email;
	}

	public MemberNameAndEmail() {
		super();
	}
	
}
