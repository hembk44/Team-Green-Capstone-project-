package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.authentication.ConfirmationToken;
import com.csci4060.app.repository.ConfirmationTokenRepository;
import com.csci4060.app.services.ConfirmationTokenService;

@Service(value = "confirmationTokenService")
public class ConfirmationTokenImpl implements ConfirmationTokenService{

	@Autowired
	ConfirmationTokenRepository confirmationTokenRepo;
	
	@Override
	public ConfirmationToken findByConfirmationToken(String confirmationToken) {
		return confirmationTokenRepo.findByConfirmationToken(confirmationToken);
	}
	@Override
	public ConfirmationToken save(ConfirmationToken token) {
		return confirmationTokenRepo.save(token);
	}

}
