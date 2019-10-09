package com.csci4060.app.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.model.event.EventDate;
import com.csci4060.app.model.event.EventDummy;
import com.csci4060.app.model.event.EventTime;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.EventDateService;
import com.csci4060.app.services.EventService;
import com.csci4060.app.services.EventTimeService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/event", produces = "application/json")
public class EventController {

	@Autowired
	UserService userService;

	@Autowired
	EventService eventService;

	@Autowired
	EventDateService eventDateService;

	@Autowired
	EventTimeService eventTimeService;

	@Autowired
	private EmailSenderService emailSenderService;

	@PostMapping(path = "/set", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse setEvent(@RequestBody EventDummy eventDummy) {

		List<User> recepientList = new ArrayList<User>();

		List<String> recepientsEmailList = eventDummy.getRecepients();
		for (String each : recepientsEmailList) {
			User recepient = userService.findByEmail(each);
			recepientList.add(recepient);
		}

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String creatorUsername = "";

		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(creatorUsername);

		Event event = new Event(eventDummy.getName(), eventDummy.getDescription(),
				eventDummy.getEventdates(), recepientList, createdBy,eventDummy.getLocation());

		eventService.save(event);

		List<EventDate> dates = event.getEventdates();

		for (EventDate date : dates) {

			eventDateService.save(date);

			List<EventTime> times = date.getEventtimes();

			for (EventTime time : times) {

				eventTimeService.save(time);
			}
		}

		SimpleMailMessage mailMessage = new SimpleMailMessage();

		String[] emails = recepientsEmailList.toArray(new String[recepientsEmailList.size()]);

		mailMessage.setTo(emails);
		mailMessage.setSubject("Event Information");
		mailMessage.setFrom("ulmautoemail@gmail.com");
		mailMessage.setText(
				"A faculty has set an event for you. Please log in to you ULM communication app and register for the event. "
						+ "Thank you!");

		emailSenderService.sendEmail(mailMessage);

		return new APIresponse(HttpStatus.CREATED.value(), "event created successfully", event);
	}

	@GetMapping(path = "faculty/allEvents")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getFacultyEvents() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		List<Event> events = eventService.findAllByCreatedBy(user);

		return new APIresponse(HttpStatus.OK.value(), "All events successfully sent.", events);

	}

	@GetMapping(path = "user/allEvents")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
	public APIresponse getStudentEvents() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		List<Event> events = eventService.findAllByRecepients(user);

		return new APIresponse(HttpStatus.OK.value(), "All events successfully sent.", events);

	}

}
