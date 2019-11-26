package com.csci4060.app.model.authentication;

import java.util.Set;

import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class SignUpForm {

	@NotEmpty(message= "Name must not be empty!")
	private String name;
	
	@NotEmpty(message= "UserName must not be empty!")
    private String username;
 
	@NotEmpty(message= "Email must not be empty!")
    private String email;
    
    private Set<String> role;
    
    @NotEmpty(message= "Password must not be empty!")
    private String password;
    
    private boolean verified = true;
}
