package com.csci4060.app.model.authentication;

import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class SignUpForm {

	@NotEmpty(message= "Name must not be empty!")
	@Size(min = 3, max = 50)
	private String name;
	
	@NotEmpty(message= "UserName must not be empty!")
    @Size(min = 3, max = 50)
    private String username;
 
	@NotEmpty(message= "Email must not be empty!")
    @Size(max = 60)
    @Email(message="Valid email is needed!")
    private String email;
    
    private Set<String> role;
    
    @NotEmpty(message= "Password must not be empty!")
    @Size(min = 6, max = 40, message= "Password must be minimum of 6 characters")
    private String password;
    
    private boolean verified = true;
}
