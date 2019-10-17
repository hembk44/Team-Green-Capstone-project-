package com.csci4060.app.services;

import com.csci4060.app.model.User;
import com.csci4060.app.model.authentication.ConfirmationToken;

public interface ConfirmationTokenService {

	ConfirmationToken findByConfirmationToken(String confirmationToken);
	ConfirmationToken save(ConfirmationToken token);

	ConfirmationToken findByUser(User user);
	void delete(ConfirmationToken token);
}
