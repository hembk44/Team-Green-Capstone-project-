package com.csci4060.app.model.authentication;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class LoginForm {

	@NotEmpty(message= "Username must not be empty")
	@Size(min = 3, max = 60)
	private String username;
	
	@NotEmpty(message= "Password must not be empty")
	@Size(min = 6, max = 40)
	private String password;
}
