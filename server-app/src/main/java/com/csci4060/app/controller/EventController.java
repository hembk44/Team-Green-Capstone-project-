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
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.model.event.EventDummy;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.EventService;
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
	private EmailSenderService emailSenderService;

	@Autowired
	CalendarService calendarService;

	@PostMapping(path = "/set", consumes = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse setEvent(@RequestBody EventDummy eventDummy) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String creatorUsername = "";

		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(creatorUsername);
		
		List<User> recipientList = new ArrayList<User>();

		List<String> recepientsEmailList = eventDummy.getRecipients();
		
		for (String each : recepientsEmailList) {
			
			User recipient = userService.findByEmail(each);
			
			if(recipient != null) {
				recipientList.add(recipient);
			}
		}
		
		Event event = new Event(eventDummy.getTitle(), eventDummy.getDescription(), eventDummy.getLocation(),
				recipientList, eventDummy.getStart(), eventDummy.getEnd(), createdBy, eventDummy.getAllDay());

		//eventService.save(event);
		
		Calendar calendar = calendarService.findById(eventDummy.getCalendarId());
		
		if(calendar.getCreatedBy() == createdBy) {
			calendar.getEvents().add(event);
			calendarService.save(calendar);
		}
		

		if (!recipientList.isEmpty()) {
			
			for (User person: recipientList) {
				Calendar mainCalendar = calendarService.findByNameAndCreatedBy("Main Calendar", person);
				mainCalendar.getEvents().add(event);
				
				System.out.println(mainCalendar.getEvents());
				
				calendarService.save(mainCalendar);
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
		}

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
