package com.csci4060.app.model.authentication;

import lombok.Data;

@Data
public class JwtResponse {

	private String accessToken;
//	private String tokenType = "Bearer";
	private String username;

	public JwtResponse(String jwt, String username2) {
		this.accessToken = jwt;
		this.username = username2;
	}

	
	
}
