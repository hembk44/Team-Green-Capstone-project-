package com.csci4060.app.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections4.ListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.csci4060.app.model.calendar.CalendarCreate;
import com.csci4060.app.model.calendar.CalendarResponse;
import com.csci4060.app.model.calendar.CalendarShare;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/calendar", produces = "application/json")
public class CalendarController {

	@Autowired
	UserService userService;

	@Autowired
	CalendarService calendarService;

	@PostMapping(path = "/create", produces = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse createCalendar(@RequestBody CalendarCreate calendarCreate) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(username);

		String calendarName = calendarCreate.getName();

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

		Calendar calendar = new Calendar(calendarName, null, recipients, createdBy, true, false);

		calendarService.save(calendar);

		CalendarResponse response = new CalendarResponse(calendar.getId(), calendar.getName(), calendar.getEvents(),
				createdBy.getUsername(), calendar.isShown(), calendar.isDefaultCalendar());
		
		return new APIresponse(HttpStatus.CREATED.value(),
				"Calendar with name " + calendarName + " has been succesfully created", response);

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

		List<CalendarResponse> responses = new ArrayList<CalendarResponse>();

		for (Calendar calendar : allCalendars) {

			responses.add(new CalendarResponse(calendar.getId(), calendar.getName(), calendar.getEvents(),
					calendar.getCreatedBy().getUsername(), calendar.isShown(), calendar.isDefaultCalendar()));
		}

		return new APIresponse(HttpStatus.OK.value(), "All calendars successfully sent.", responses);

	}

	@PostMapping(path = "/share", produces = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse shareCalendar(@RequestBody CalendarShare calendarShare) {

		Calendar calendar = calendarService.findById(calendarShare.getCalendarId());
		
		List<String> emailsFromJson = calendarShare.getRecipients();
		List<String> sharedWithList = new ArrayList<String>();

		CalendarResponse response = null;

		if (calendar != null) {
			for (String email : emailsFromJson) {

				User user = userService.findByEmail(email);
				if (user != null && calendar.getCreatedBy() != user) {
					sharedWithList.add(email);
					calendar.getShareduser().add(user);
					calendarService.save(calendar);
				}

			}

			response = new CalendarResponse(calendar.getId(), calendar.getName(), calendar.getEvents(),
					calendar.getCreatedBy().getEmail(), calendar.isShown(), calendar.isDefaultCalendar());
		}
		return new APIresponse(HttpStatus.OK.value(),
				"Calendar " + calendar.getName() + " has been shared to users: " + sharedWithList, response);
	}
}
