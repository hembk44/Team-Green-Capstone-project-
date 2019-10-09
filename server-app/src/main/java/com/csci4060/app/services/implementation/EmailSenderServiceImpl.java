package com.csci4060.app.services.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.csci4060.app.services.EmailSenderService;

@Service("emailSenderService")
public class EmailSenderServiceImpl implements EmailSenderService{

		@Autowired
		private JavaMailSender javaMailSender;
	    
		@Async
		public void sendEmail(SimpleMailMessage email) {
			javaMailSender.send(email);
			
		}


}
