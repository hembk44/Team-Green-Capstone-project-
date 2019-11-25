package com.csci4060.app.model.authentication;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class LoginForm {

	@NotEmpty(message= "Username must not be empty")
	private String username;
	
	@NotEmpty(message= "Password must not be empty")
	private String password;
}
