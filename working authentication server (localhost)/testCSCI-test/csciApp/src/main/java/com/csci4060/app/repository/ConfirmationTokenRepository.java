package com.csci4060.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.authentication.ConfirmationToken;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, String>{
	ConfirmationToken findByConfirmationToken(String confirmationToken);

}
