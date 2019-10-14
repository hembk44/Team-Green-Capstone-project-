package com.csci4060.app.services.implementation;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.authentication.ConfirmationToken;
import com.csci4060.app.repository.authenticationRepo.ConfirmationTokenRepository;
import com.csci4060.app.services.ConfirmationTokenService;

@Service(value = "confirmationTokenService")
public class ConfirmationTokenImpl implements ConfirmationTokenService{

	@Autowired
	ConfirmationTokenRepository confirmationTokenRepo;
	
	@Override
	public ConfirmationToken findByConfirmationToken(String confirmationToken) {
		Optional<ConfirmationToken> token = confirmationTokenRepo.findByConfirmationToken(confirmationToken);
		if(token.isPresent()) {
			return token.get();
		}
		return null;
	}
	@Override
	public ConfirmationToken save(ConfirmationToken token) {
		return confirmationTokenRepo.save(token);
	}

}
