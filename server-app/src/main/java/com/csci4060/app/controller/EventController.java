package com.csci4060.app.controller;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.security.sasl.AuthenticationException;
<<<<<<< HEAD

import javax.validation.Valid;


=======
import javax.validation.Valid;

>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.ExceptionResolver;
<<<<<<< HEAD

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
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
<<<<<<< HEAD

public class EventController extends ExceptionResolver {


=======
public class EventController extends ExceptionResolver {

>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	@Autowired
	UserService userService;

	@Autowired
	EventService eventService;

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
	CalendarService calendarService;

	@PostMapping(path = "/set", consumes = "application/json")
<<<<<<< HEAD
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
	public APIresponse setEvent(@Valid @RequestBody EventDummy eventDummy)

=======
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR')")
	public APIresponse setEvent(@Valid @RequestBody EventDummy eventDummy)
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
			throws FileNotFoundException, AuthenticationException {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String creatorUsername = "";

		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(creatorUsername);

		List<User> recipientList = new ArrayList<User>();

		List<String> recepientsEmailList = eventDummy.getRecipients();

<<<<<<< HEAD

		List<String> actualRecipients = new ArrayList<>();


=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
		for (String each : recepientsEmailList) {

			User recipient = userService.findByEmail(each);

			if (recipient != null) {
				recipientList.add(recipient);
<<<<<<< HEAD

				actualRecipients.add(each);
			}
		}

		Calendar calendar = calendarService.findById(eventDummy.getCalendarId());

		if (calendar == null) {
			throw new FileNotFoundException("Calendar with given id is not present in the database");
		}
		
		Event event = new Event(eventDummy.getTitle(), eventDummy.getDescription(), eventDummy.getLocation(),
				recipientList, eventDummy.getStart(), eventDummy.getEnd(), createdBy, eventDummy.getAllDay(),
				calendar.getColor(), eventDummy.getBackgroundColor());

=======
			}
		}

		Event event = new Event(eventDummy.getTitle(), eventDummy.getDescription(), eventDummy.getLocation(),
				recipientList, eventDummy.getStart(), eventDummy.getEnd(), createdBy, eventDummy.getAllDay(),
				eventDummy.getBorderColor(), eventDummy.getBackgroundColor());
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

		eventService.save(event);

		Long newEventId = event.getId();
<<<<<<< HEAD

=======
		//System.out.println(newEventId);

		Calendar calendar = calendarService.findById(eventDummy.getCalendarId());

		if (calendar == null) {
			throw new FileNotFoundException("Calendar with given id is not present in the database");
		}
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

		if (calendar.getCreatedBy() == createdBy) {
			calendar.getEvents().add(event);
			calendarService.save(calendar);
		} else {
			throw new AuthenticationException("You are not allowed to create an event for this calendar");
		}

		if (!recipientList.isEmpty()) {

			for (User sharedToPerson : recipientList) {

				Calendar recipientCalendar = null;

				if (!calendar.getShareduser().contains(sharedToPerson)) {
					recipientCalendar = calendarService.findByNameAndCreatedBy("Shared Event", sharedToPerson);
					recipientCalendar.addEvent(event);
					calendarService.save(recipientCalendar);
				}
			}

<<<<<<< HEAD
		}

		if (!actualRecipients.isEmpty()) {
			
			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = actualRecipients.toArray(new String[actualRecipients.size()]);
=======
			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = recepientsEmailList.toArray(new String[recepientsEmailList.size()]);
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

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

}
