package com.csci4060.app.model.authentication;

import lombok.Data;

@Data
public class JwtResponse {

	private String accessToken;
	private String name;
	private String username;
	private String role;


	public JwtResponse(String jwt, String name, String username2, String role) {

		this.accessToken = jwt;
		this.name = name;
		this.username = username2;
		this.role = role;

	}

	
	
}
