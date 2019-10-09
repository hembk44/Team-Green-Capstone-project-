package com.csci4060.app.model.authentication;

import lombok.Data;

@Data
public class JwtResponse {

	private String accessToken;
	private String username;
<<<<<<< HEAD

	public JwtResponse(String jwt, String username2) {
		this.accessToken = jwt;
		this.username = username2;
=======
	private String role;

	public JwtResponse(String jwt, String username2, String role) {
		this.accessToken = jwt;
		this.username = username2;
		this.role = role;
>>>>>>> hemsBaral/alpha-demo
	}

	
	
}
