package com.csci4060.app.controller;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

import javax.security.sasl.AuthenticationException;

import javax.validation.Valid;

import org.apache.commons.collections4.ListUtils;
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
import com.csci4060.app.model.calendar.CalendarCreate;
import com.csci4060.app.model.calendar.CalendarShare;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/calendar", produces = "application/json")

public class CalendarController extends ExceptionResolver {

	@Autowired
	UserService userService;

	@Autowired
	CalendarService calendarService;

	@Autowired
	EmailSenderService emailSenderService;

	@PostMapping(path = "/create", produces = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")

	public APIresponse createCalendar(@Valid @RequestBody CalendarCreate calendarCreate) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(username);

		String calendarName = calendarCreate.getName();
		String calendarColor = calendarCreate.getColor();

		if (calendarColor == null) {
			calendarColor = "#800029";
		}

		if (calendarService.findByNameAndCreatedBy(calendarName, createdBy) != null) {

			return new APIresponse(HttpStatus.CONFLICT.value(),
					"Calendar with name " + calendarName + " already exists.Please choose a different name.", null);
		}

		List<String> calendarRecipients = calendarCreate.getRecipients();
		List<String> realRecipients = new ArrayList<String>();

		List<User> recipients = new ArrayList<>();

		for (String email : calendarRecipients) {

			User sharedToUser = userService.findByEmail(email);
			if (userService.existsByEmail(email) && sharedToUser != createdBy) {
				recipients.add(userService.findByEmail(email));
				realRecipients.add(email);
			}
		}

		Calendar calendar = new Calendar(calendarName, calendarColor, null, recipients, createdBy, true, false);

		calendarService.save(calendar);

		if (!realRecipients.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = realRecipients.toArray(new String[realRecipients.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Calendar Added");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("This email is to inform you that " + calendar.getCreatedBy().getName()
					+ " has shared a calendar named " + calendar.getName() + " with you." + "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.CREATED.value(),
				"Calendar with name " + calendarName + " has been succesfully created", calendar);

	}

	@GetMapping(path = "/allCalendars")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getCalendars() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		List<Calendar> allCalendars = new ArrayList<>();

		List<Calendar> ownedCalendars = calendarService.findAllByCreatedBy(user);

		List<Calendar> sharedCalendars = calendarService.findAllByShareduser(user);

		if (sharedCalendars != null) {
			allCalendars = ListUtils.union(ownedCalendars, sharedCalendars);
		} else {
			allCalendars = ownedCalendars;
		}

		return new APIresponse(HttpStatus.OK.value(), "All calendars successfully sent.", allCalendars);

	}

	@PostMapping(path = "/share", produces = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")

	public APIresponse shareCalendar(@Valid @RequestBody CalendarShare calendarShare)

			throws FileNotFoundException, AuthenticationException {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Calendar calendar = calendarService.findById(calendarShare.getCalendarId());

		if (calendar == null) {
			throw new FileNotFoundException("Calendar with the given id is not present in the database");
		}

		if (calendar.getCreatedBy() != user) {
			throw new AuthenticationException("You are not allowed to share this calendar.");
		}

		List<String> emailsFromJson = calendarShare.getRecipients();
		List<String> sharedWithList = new ArrayList<String>();

		for (String email : emailsFromJson) {

			User personToShare = userService.findByEmail(email);
			if (personToShare != null && calendar.getCreatedBy() != personToShare) {
				if (!calendar.getShareduser().contains(personToShare)) {
					sharedWithList.add(email);
					calendar.getShareduser().add(personToShare);
					calendarService.save(calendar);
				}

			}

		}

		if (!sharedWithList.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = sharedWithList.toArray(new String[sharedWithList.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Calendar Shared");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("This email is to inform you that " + calendar.getCreatedBy().getName()
					+ " has shared a calendar named " + calendar.getName() + " wiith you." + "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.OK.value(),
				"Calendar " + calendar.getName() + " has been shared to users: " + sharedWithList, calendar);
	}

	@PutMapping(path = "/edit/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse editEvent(@Valid @RequestBody CalendarCreate calendarCreate,
			@PathVariable("id") Long calendarId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Calendar calendar = calendarService.findById(calendarId);

		if (calendar == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Calendar with id " + calendarId + " does not exist",
					null);
		}

		if (calendar.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(),
					"You did not create the Calendar. Authorization denied!", null);
		}

		String calendarName = calendar.getName();
		
		if (!calendarName.equals(calendarCreate.getName())) {
			if (calendarService.findByNameAndCreatedBy(calendarCreate.getName(), calendar.getCreatedBy()) != null) {

				return new APIresponse(HttpStatus.CONFLICT.value(),
						"Calendar with name " + calendarCreate.getName() + " already exists.Please choose a different name.",
						null);
			}
		}

		calendar.setName(calendarCreate.getName());
		
		String calendarColor = calendarCreate.getColor();
		
		if(calendarColor == null) {
			calendarColor = "#800029";
		}
		calendar.setColor(calendarColor);

		List<String> editedEmails = calendarCreate.getRecipients();

		List<User> newRecipients = new ArrayList<>();
		List<User> oldRecipients = calendar.getShareduser();

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
			calendar.getShareduser().add(newUser);
		}

		for (User oldUser : deletedUsers) {
			deletedUserEmail.add(oldUser.getEmail());
			calendar.getShareduser().remove(oldUser);
		}

		calendarService.save(calendar);

		if (!addedUserEmail.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = addedUserEmail.toArray(new String[addedUserEmail.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Calendar Shared");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("This email is to inform you that " + calendar.getCreatedBy().getName()
					+ " has shared a calendar named " + calendar.getName() + " with you." + "Thank you!");
			emailSenderService.sendEmail(mailMessage);
		}

		if (!deletedUserEmail.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = deletedUserEmail.toArray(new String[deletedUserEmail.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Calendar removed");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("You have been removed from a calendar named " + calendar.getName() + "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.OK.value(), "Calendar has been successfully edited", calendar);
	}

	@DeleteMapping(path = "/delete/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse deleteCalendar(@PathVariable("id") Long calendarId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Calendar calendar = calendarService.findById(calendarId);

		if (calendarId == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "Calendar with id " + calendarId + " does not exists.",
					null);
		}

		if (calendar.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(),
					"You did not create the calendar. Authorization denied!", null);
		}

		if (calendar.getName().equals("Main") || calendar.getName().equals("Appointment")
				|| calendar.getName().equals("Shared Event")) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You cannot delete default calendars.", null);
		}

		List<User> recipientsList = calendar.getShareduser();
		List<String> recipientsEmailList = new ArrayList<String>();

		for (User recipient : recipientsList) {
			recipientsEmailList.add(recipient.getEmail());
		}

		calendarService.delete(calendar);

		if (!recipientsEmailList.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = recipientsEmailList.toArray(new String[recipientsEmailList.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Calendar deleted");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("This email is to inform you that " + calendar.getCreatedBy().getName()
					+ " has deleted a calendar named " + calendar.getName() + " which was shared to you."
					+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.OK.value(), "Calendar was successfully deleted.", calendar);
	}
}
