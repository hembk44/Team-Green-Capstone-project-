package com.csci4060.app.repository.authenticationRepo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;
import com.csci4060.app.model.authentication.ConfirmationToken;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, String>{
	Optional<ConfirmationToken> findByConfirmationToken(String confirmationToken);
	Optional<ConfirmationToken> findByUser(User user);
	void deleteByConfirmationToken(String token); 
	 

}
