package com.csci4060.app.controller;

import java.io.FileNotFoundException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.security.sasl.AuthenticationException;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.ExceptionResolver;

import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.model.event.EventDummy;
import com.csci4060.app.model.event.EventEdit;
import com.csci4060.app.model.event.EventShare;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.EventService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/event", produces = "application/json")

public class EventController extends ExceptionResolver {

	@Autowired
	UserService userService;

	@Autowired
	EventService eventService;

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
	CalendarService calendarService;

	@PostMapping(path = "/set", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR') or hasRole('USER')")
	public APIresponse setEvent(@Valid @RequestBody EventDummy eventDummy)

			throws FileNotFoundException, AuthenticationException {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String creatorUsername = "";

		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(creatorUsername);

		List<User> recipientList = new ArrayList<User>();

		List<String> recepientsEmailList = eventDummy.getRecipients();

		List<String> actualRecipients = new ArrayList<>();

		String backgroundColor = eventDummy.getBackgroundColor();

		if (backgroundColor == null) {
			backgroundColor = "";
		}
		for (String each : recepientsEmailList) {

			User recipient = userService.findByEmail(each);

			if (recipient != null) {
				recipientList.add(recipient);
				actualRecipients.add(each);
			}
		}

		Calendar calendar = calendarService.findById(eventDummy.getCalendarId());

		if (calendar == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(),
					"Calendar with the given id is not present in the database", null);
		}

		Event event = new Event(eventDummy.getTitle(), eventDummy.getDescription(), eventDummy.getLocation(),
				recipientList, eventDummy.getStart(), eventDummy.getEnd(), createdBy, eventDummy.getAllDay(),
				calendar.getColor(), backgroundColor);

		eventService.save(event);

		if (calendar.getCreatedBy() == createdBy) {
			calendar.getEvents().add(event);
			calendarService.save(calendar);
		} else {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"You did not create the calendar. Authorization denied!", null);
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
		}

		if (!actualRecipients.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = actualRecipients.toArray(new String[actualRecipients.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Event Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText(
					"A faculty has set an event for you. Please log in to you ULM communication app and register for the event. "
							+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.CREATED.value(), "Event " + event.getTitle() + " created successfully",
				event);
	}

	@PostMapping(path = "/confirm/{id}", consumes = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR')")
	public APIresponse confirmEvent(@PathVariable("id") Long eventId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String creatorUsername = "";

		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails) principal).getUsername();
		}

		User loggedInUser = userService.findByUsername(creatorUsername);

		Event event = eventService.findById(eventId);

		if (event == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(),
					"Event with the given id does not exist in the database", null);
		}

		if (!event.getRecipients().contains(loggedInUser)) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "You are not the recipient of this event", null);
		}

		if (event.getConfirmedBy().contains(loggedInUser)) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "You have already confirmed this event", null);
		}

		event.getConfirmedBy().add(loggedInUser);
		eventService.save(event);

		return new APIresponse(HttpStatus.OK.value(), "Event confirmed successfully.", event);
	}

	@PostMapping(path = "/share")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR')")
	public APIresponse shareGroup(@Valid @RequestBody EventShare eventShare) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Long eventId = eventShare.getEventId();

		Event event = eventService.findById(eventId);

		if (event == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "Event with id " + eventId + " does not exist", null);
		}

		if (event.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"You did not create the event. Authorization denied!", null);
		}

		if (event.getTimeSlotId() != null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"This is an appointment. Please go to the appointment tab to add/delete users", null);
		}

		List<String> emailsFromJson = eventShare.getRecipients();
		List<String> sharedWithList = new ArrayList<String>();

		for (String email : emailsFromJson) {

			User personToShare = userService.findByEmail(email);
			if (personToShare != null) {
				if (!event.getRecipients().contains(personToShare)) {

					sharedWithList.add(email);
					event.getRecipients().add(personToShare);
					eventService.save(event);

					Calendar recipientCalendar = calendarService.findByNameAndCreatedBy("Shared Event", personToShare);
					recipientCalendar.addEvent(event);
					calendarService.save(recipientCalendar);
				}

			}

		}

		return new APIresponse(HttpStatus.OK.value(), "Event " + event.getTitle() + " has been shared.", event);
	}

	@PutMapping(path = "/edit/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR')")
	public APIresponse editEvent(@Valid @RequestBody EventEdit eventEdit, @PathVariable("id") Long eventId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Event event = eventService.findById(eventId);

		if (event == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "Event with id " + eventId + " does not exist", null);
		}

		if (event.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"You did not create the event. Authorization denied!", null);
		}

		if (event.getTimeSlotId() != null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"This is an appointment. Please go to the appointment tab to edit the appointment", null);
		}

		Calendar calendar = calendarService.findById(eventEdit.getCalendarId());

		if (calendar == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(),
					"Calendar with id " + eventEdit.getCalendarId() + " does not exist", null);
		}

		if (calendar.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"You did not create the Calendar. So you cannot put the event in this calendar.", null);
		}

		event.setTitle(eventEdit.getTitle());
		event.setDescription(eventEdit.getDescription());
		event.setLocation(eventEdit.getLocation());
		event.setStart(eventEdit.getStart());
		event.setEnd(eventEdit.getEnd());
		event.setBackgroundColor(eventEdit.getBackgroundColor());
		event.setBorderColor(calendar.getColor());
		event.setAllDay(eventEdit.getAllDay());

		List<String> editedEmails = eventEdit.getRecipients();

		List<User> confirmedUser = event.getConfirmedBy();

		List<User> newRecipients = new ArrayList<>();
		List<User> oldRecipients = event.getRecipients();

		List<User> deletedUsers = new ArrayList<User>();
		List<String> deletedUserEmail = new ArrayList<String>();

		List<User> addedUsers = new ArrayList<User>();
		List<String> addedUserEmail = new ArrayList<String>();

		for (String email : editedEmails) {
			User newRecipientUser = userService.findByEmail(email);
			if (newRecipientUser != null) {
				newRecipients.add(newRecipientUser);
				if (!oldRecipients.contains(newRecipientUser)) {
					addedUsers.add(newRecipientUser);
				}
			}
		}

		for (User oldRecipient : oldRecipients) {
			if (!newRecipients.contains(oldRecipient)) {
				deletedUsers.add(oldRecipient);
			}
		}

		for (User newUser : addedUsers) {
			addedUserEmail.add(newUser.getEmail());
			event.getRecipients().add(newUser);

			Calendar newCalendar = calendarService.findByNameAndCreatedBy("Shared Event", newUser);
			newCalendar.addEvent(event);
			calendarService.save(newCalendar);
		}

		for (User oldUser : deletedUsers) {
			deletedUserEmail.add(oldUser.getEmail());
			event.getRecipients().remove(oldUser);

			Calendar deletedCalendar = calendarService.findByNameAndCreatedBy("Shared Event", oldUser);
			deletedCalendar.removeEvent(event);
			calendarService.save(deletedCalendar);

			if (confirmedUser.contains(oldUser)) {
				event.getConfirmedBy().remove(oldUser);
			}
		}

		eventService.save(event);

		if (!addedUserEmail.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = addedUserEmail.toArray(new String[addedUserEmail.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Event Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText(
					"A faculty has set an event for you. Please log in to you ULM communication app and register for the event. Thank you!");
			emailSenderService.sendEmail(mailMessage);
		}

		if (!deletedUserEmail.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = deletedUserEmail.toArray(new String[deletedUserEmail.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Event Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("A faculty has cancelled an event with name " + event.getTitle()
					+ " If you have cofirmed the event, we apologize for the inconvenience." + "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.OK.value(), "Event has been successfully edited", event);
	}

	@DeleteMapping(path = "/delete/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR')")
	public APIresponse deleteEvent(@PathVariable("id") Long eventId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Event event = eventService.findById(eventId);

		if (event == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "Event with id " + eventId + " does not exist.", null);
		}

		if (event.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"You did not create the event. Authorization denied!", null);
		}

		if (event.getTimeSlotId() != null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"This is an appointment time slot. You cannot delete an individual time slot. Please go to the appointment tab to delete the whole appointment.",
					null);
		}

		List<User> recipientsList = event.getRecipients();
		List<String> recipientsEmailList = new ArrayList<String>();

		for (User recipient : recipientsList) {
			recipientsEmailList.add(recipient.getEmail());
		}

		eventService.delete(event);

		if (!recipientsEmailList.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = recipientsEmailList.toArray(new String[recipientsEmailList.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Event Cancelled");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("A faculty has cancelled an event with name " + event.getTitle()
					+ " If you have confirmed to attend this event, we apologize for the inconvenience."
					+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.OK.value(), "Event was successfully deleted.", event);
	}

	@GetMapping(path = "/upCommingEvents")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN') or hasRole('MODERATOR')")
	public APIresponse getUpcommingEvents() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		DateFormat f = new SimpleDateFormat("MM/dd/yy");

		List<Event> createdEvents = eventService.findAllByCreatedBy(user);
		List<Event> receivedEvents = eventService.findAllByRecepients(user);

		if (createdEvents == null && receivedEvents == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "There are no events at the moment.", null);
		}

		Set<Event> allEvents = new HashSet<Event>();

		String currentDateString = new SimpleDateFormat("MM/dd/yy").format(new Date());
		Date currentDate = null;

		try {
			currentDate = f.parse(currentDateString);
		} catch (ParseException e1) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Cannot parse current Date.", null);
		}

		if (createdEvents != null) {
			for (Event event : createdEvents) {
				String date = event.getStart().substring(0, 10);
				Date eventDate = null;
				try {
					eventDate = (Date) f.parse(date);

					if (!eventDate.before(currentDate)) {
						allEvents.add(event);
					}
				} catch (ParseException e) {
					return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Cannot parse created event's Date.", null);
				}
			}
		}

		if (receivedEvents != null) {
			for (Event event : receivedEvents) {
				String date = event.getStart().substring(0, 10);
				Date eventDate = null;
				try {
					eventDate = (Date) f.parse(date);

					if (!eventDate.before(currentDate)) {
						allEvents.add(event);
					}
				} catch (ParseException e) {
					return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Cannot parse received event's Date", null);
				}
			}
		}

		return new APIresponse(HttpStatus.OK.value(), "Upcomming events succesfully sent.", allEvents);
	}
}
