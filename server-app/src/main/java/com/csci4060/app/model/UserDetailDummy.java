package com.csci4060.app.model;


public class UserDetailDummy {


	private String name;
	
	
	private String email;
	
	private RoleName role;


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public RoleName getRoles() {
		return role;
	}


	public void setRoles(RoleName roles) {
		this.role = roles;
	}


	public UserDetailDummy( String name, String email, RoleName roleName) {
		
	
		this.name = name;
		this.email = email;
		this.role = roleName;
	}
	

	public UserDetailDummy() {
		super();
		
	}

	
	
	

}
