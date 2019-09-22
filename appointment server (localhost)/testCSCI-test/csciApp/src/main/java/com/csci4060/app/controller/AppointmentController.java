package com.csci4060.app.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.AppointmentDummy;
import com.csci4060.app.services.AppointmentService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/appointment", produces = "application/json")
public class AppointmentController {
	
	@Autowired
	UserService userService;

	@Autowired
	AppointmentService appointmentService;
	
	@PostMapping(path = "/set", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse setAppointment(@RequestBody AppointmentDummy appointmentDummy, HttpServletRequest request) {
		
		List<User> recepientList = new ArrayList<User>();
				
		List<String> recepientsEmailList = appointmentDummy.getRecepients();
		for(String each: recepientsEmailList) {
			User recepient = userService.findByEmail(each);
			recepientList.add(recepient);
		}
		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		String creatorUsername = "";
		
		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails)principal).getUsername();
		}
		
		User createdBy = userService.findByUsername(creatorUsername);
		
		Appointment appointment = new Appointment(appointmentDummy.getName(), appointmentDummy.getDescription(),appointmentDummy.getDates(), recepientList,createdBy);
		
		appointmentService.save(appointment);
		
		return new APIresponse(HttpStatus.CREATED.value(),"Appointment created successfully", null);
	}
	
}
