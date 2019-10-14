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
	public APIresponse shareCalendar(@RequestBody CalendarShare calendarShare){
		
		Calendar calendar = calendarService.findById(calendarShare.getCalendarId());
		
		List<String> emailsFromJson = calendarShare.getEmails();
		List<String> sharedWithList = new ArrayList<String>();
		
		if(calendar != null) {
			for(String email: emailsFromJson) {
		
				User user = userService.findByEmail(email);
				if(user != null && calendar.getCreatedBy() != user) {
					sharedWithList.add(email);
					calendar.getShareduser().add(user);
					calendarService.save(calendar);
				}
				
			}
		}
		return new APIresponse(HttpStatus.OK.value(), "Calendar "+calendar.getName()+" has been shared to users: "+ sharedWithList, calendar);
	}
}
