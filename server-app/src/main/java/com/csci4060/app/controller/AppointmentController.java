package com.csci4060.app.controller;

import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

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
import org.springframework.web.client.ResourceAccessException;


import com.csci4060.app.ExceptionResolver;

import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.AppointmentDate;
import com.csci4060.app.model.appointment.AppointmentDummy;
import com.csci4060.app.model.appointment.AppointmentEdit;
import com.csci4060.app.model.appointment.AppointmentResponse;
import com.csci4060.app.model.appointment.AppointmentTime;
import com.csci4060.app.model.appointment.DateAndTimeSlotResponse;
import com.csci4060.app.model.appointment.ResponseWithPendingUser;
import com.csci4060.app.model.appointment.TimeSlotResponse;
import com.csci4060.app.model.appointment.TimeSlots;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.services.AppointmentDateService;
import com.csci4060.app.services.AppointmentService;
import com.csci4060.app.services.AppointmentTimeService;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.EventService;
import com.csci4060.app.services.TimeSlotsService;
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/appointment", produces = "application/json")

public class AppointmentController extends ExceptionResolver {


	@Autowired
	UserService userService;

	@Autowired
	AppointmentService appointmentService;

	@Autowired
	AppointmentDateService appointmentDateService;

	@Autowired
	AppointmentTimeService appointmentTimeService;

	@Autowired
	TimeSlotsService timeSlotsService;

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
	CalendarService calendarService;

	@Autowired
	EventService eventService;

	@PostMapping(path = "/set", consumes = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")

	public APIresponse setAppointment( @Valid @RequestBody AppointmentDummy appointmentDummy, HttpServletRequest request) {


		List<User> recepientList = new ArrayList<User>();

		List<String> emailFromDummy = appointmentDummy.getRecepients();

		List<String> recepientsEmailList = new ArrayList<String>();

		for (String each : emailFromDummy) {
			User recepient = userService.findByEmail(each);
			if (recepient != null) {
				recepientList.add(recepient);
				recepientsEmailList.add(each);
			}
		}

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String creatorUsername = "";

		if (principal instanceof UserDetails) {
			creatorUsername = ((UserDetails) principal).getUsername();
		}

		User createdBy = userService.findByUsername(creatorUsername);

		Appointment appointment = new Appointment(appointmentDummy.getName(), appointmentDummy.getDescription(),
				appointmentDummy.getAppdates(), recepientList, createdBy, appointmentDummy.getLocation());

		List<AppointmentDate> dates = appointment.getAppdates();

		//Stores all the timeslots
		List<TimeSlots> timeSlots = new ArrayList<TimeSlots>();

		for (AppointmentDate date : dates) {

			List<AppointmentTime> times = date.getApptimes();

			for (AppointmentTime time : times) {

				LocalTime sTime = LocalTime.parse(time.getStartTime(), DateTimeFormatter.ofPattern("hh:mm a"));
				LocalTime eTime = LocalTime.parse(time.getEndTime(), DateTimeFormatter.ofPattern("hh:mm a"));

				String result1 = LocalTime.parse(sTime.toString(), DateTimeFormatter.ofPattern("HH:mm"))
						.format(DateTimeFormatter.ofPattern("hh:mm a"));
				
				

				String result2 = LocalTime.parse(eTime.toString(), DateTimeFormatter.ofPattern("HH:mm"))
						.format(DateTimeFormatter.ofPattern("hh:mm a"));
				

				long elapsedMinutes = Math.abs(Duration.between(sTime, eTime).toMinutes());
				
				if (Duration.between(sTime, eTime).toHours() > 8)
				{
					return new APIresponse(HttpStatus.FORBIDDEN.value(), "Sorry! The interval between start time and end time of your Appointment cannot be more than 8 hours! Please consider adding another time!", null);
				}
				
				long maxAppointment = elapsedMinutes / time.getInterv();

				LocalTime slotStartTime = sTime;

				for (int i = 0; i < maxAppointment; i++) {
					LocalTime slotEndTime = slotStartTime.plusMinutes(time.getInterv());
					String timeSlotStart = LocalTime
							.parse(slotStartTime.toString(), DateTimeFormatter.ofPattern("HH:mm"))
							.format(DateTimeFormatter.ofPattern("hh:mm a"));
					String timeSlotEnd = LocalTime.parse(slotEndTime.toString(), DateTimeFormatter.ofPattern("HH:mm"))
							.format(DateTimeFormatter.ofPattern("hh:mm a"));
					// storing each timeslots in a variable instead of directly saving in the
					// database. Because timeslots references AppointmentDate object but we haven't
					// saved the date yet.
					timeSlots.add(new TimeSlots(timeSlotStart, timeSlotEnd, date, appointment, null));
					slotStartTime = slotEndTime;
				}

			}

		}
		
		
		

		if (timeSlots.size() < emailFromDummy.size())
		{
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "Sorry! The generated Appointment Slots are not enough for provided numbers of Recepients! Please add more time slots or reduce number of recepients!", null);
		}
		
		
		
		
		for (AppointmentDate date : dates) {

			List<AppointmentTime> times = date.getApptimes();

			for (AppointmentTime time : times) {

				// saving the time before date in the database to avoid transient error(appdate
				// references apptime)
				appointmentTimeService.save(time);
			}

			// Saving the date before appointment because appointment has appDates
			appointmentDateService.save(date);
		}
		// saving the appointment in the database
		appointmentService.save(appointment);
		
		
		
		
		//Going through each timeslots and saving in the database.
		for (TimeSlots slots : timeSlots) {
			timeSlotsService.save(slots);
		}

		if (!recepientsEmailList.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = recepientsEmailList.toArray(new String[recepientsEmailList.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Appointment Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText(
					"A faculty has set an appointment named "+appointment.getName()+" for you. Please log in to you ULM communication app and register for the appointment. "
							+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.CREATED.value(), "Appointment created successfully", appointment);
	}

	@GetMapping(path = "created/allAppointments")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getFacultyAppointments() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		List<Appointment> appointments = appointmentService.findAllByCreatedBy(user);

		if (appointments == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "You have not created any appointments yet.", null);
		}

		List<AppointmentResponse> allAppointments = new ArrayList<AppointmentResponse>();

		for (Appointment app : appointments) {

			List<String> responseDate = new ArrayList<String>();
			for (AppointmentDate date : app.getAppdates()) {
				responseDate.add(date.getDate());

			}

			allAppointments
					.add(new AppointmentResponse(app.getId(), app.getName(), app.getDescription(), app.getLocation(), responseDate));

		}

		return new APIresponse(HttpStatus.OK.value(), "All appointments successfully sent.", allAppointments);

	}

	@GetMapping(path = "received/allAppointments")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getAppointments() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		List<Appointment> appointments = appointmentService.findAllByRecepients(user);

		if (appointments == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "You have not created any appointments yet.", null);
		}

		List<AppointmentResponse> allAppointments = new ArrayList<AppointmentResponse>();

		for (Appointment app : appointments) {

			List<String> responseDate = new ArrayList<String>();
			for (AppointmentDate date : app.getAppdates()) {
				responseDate.add(date.getDate());

			}

			allAppointments
					.add(new AppointmentResponse(app.getId(), app.getName(), app.getDescription(), app.getLocation(), responseDate));

		}

		return new APIresponse(HttpStatus.OK.value(), "All appointments successfully sent.", allAppointments);

	}

	@GetMapping(path = "/timeslots/user/{id}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('PM')")
	public APIresponse getSlots(@PathVariable("id") Long appointmentId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);
		
		

		Appointment appointment = appointmentService.findById(appointmentId);
		List<AppointmentDate> dates = appointment.getAppdates();
		
		List<DateAndTimeSlotResponse> response = new ArrayList<DateAndTimeSlotResponse>();
		
		for (AppointmentDate date: dates)
		{
			List<TimeSlots> slotsFromAppdate= timeSlotsService.allTimeslotsByAppdate(date);
			
			List<TimeSlotResponse> timeSlotResponses = new ArrayList<TimeSlotResponse>();

			for (TimeSlots slots : slotsFromAppdate) {
	
				if (slots.getSelectedBy() == null) {
					timeSlotResponses.add(new TimeSlotResponse(slots.getId(), slots.getStartTime(), slots.getEndTime(),
							slots.getAppdates().getDate(), appointment.getName(), appointment.getDescription(),
							appointment.getCreatedBy().getName()));
				} else if (slots.getSelectedBy() == user) {
					return new APIresponse(HttpStatus.OK.value(), "User has already selected a slot.", null);
				}
			}
			
			response.add(new DateAndTimeSlotResponse(date.getDate(), timeSlotResponses, appointment.getLocation()));
			
		}

		return new APIresponse(HttpStatus.OK.value(), "Time slots successfully sent.", response);
	}

	@GetMapping(path = "/timeslots/faculty/{id}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse getSlotsForFaculty(@PathVariable("id") Long appointmentId) {
		
		
		
		List<DateAndTimeSlotResponse> response = new ArrayList<DateAndTimeSlotResponse>();
		//ResponseWithPendingUser finalResponse = new ArrayList<ResponseWithPendingUser>();


		Appointment appointment = appointmentService.findById(appointmentId);
		List<AppointmentDate> dates = appointment.getAppdates();
		
		List<User> allRecepients = appointment.getRecepients();
		List<User> confirmedUsers = new ArrayList<User>();
 		
		
		for (AppointmentDate date: dates)
		{
			List<TimeSlots> slotsFromAppdate= timeSlotsService.allTimeslotsByAppdate(date);
			
			List<TimeSlotResponse> timeSlotResponses = new ArrayList<TimeSlotResponse>();
			for (TimeSlots slots : slotsFromAppdate) {

				String selectorName = "Not selected";
				String selectorEmail = "Not selected";

				if (slots.getSelectedBy() != null)
				{
					
					
					User selectedBy = slots.getSelectedBy();
					confirmedUsers.add(selectedBy);

					selectorName = selectedBy.getName();
					selectorEmail = selectedBy.getEmail();

				}

				timeSlotResponses.add(new TimeSlotResponse(slots.getId(), slots.getStartTime(), slots.getEndTime(),
						slots.getAppdates().getDate(), selectorName, selectorEmail, appointment.getName(),
						appointment.getDescription(), appointment.getCreatedBy().getName()));
				
			}
			
			boolean pending = allRecepients.removeAll(confirmedUsers);
			
			response.add(new DateAndTimeSlotResponse(date.getDate(), timeSlotResponses, appointment.getLocation()));
		}
		
		
		ResponseWithPendingUser finalResponse = new ResponseWithPendingUser(response, allRecepients);

		return new APIresponse(HttpStatus.OK.value(), "Time slots successfully sent.", finalResponse);
	}

	@PostMapping(path = "timeslots/postSlot/{timeSlotId}", produces = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('ADMIN')")
	public APIresponse postSlots(@PathVariable("timeSlotId") long id) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User selectedBy = userService.findByUsername(username);
		
		List<User> confirmedBy = new ArrayList<User>();
		confirmedBy.add(selectedBy);

		TimeSlots slotToRemove = timeSlotsService.findById(id);

		if (slotToRemove == null) {
			throw new ResourceAccessException("There is no timeslot with given id " + id + " in the database");
		}

		slotToRemove.setSelectedBy(selectedBy);
		timeSlotsService.save(slotToRemove);

		Event creatorsEvent = eventService.findByTimeSlotId(id);
		creatorsEvent.setConfirmedBy(confirmedBy);

		System.out.println("Event from timeslot: " + creatorsEvent);

		Calendar calendar = calendarService.findByNameAndCreatedBy("Appointment", selectedBy);

		System.out.println("calendar before adding event" + calendar);

		calendar.addEvent(creatorsEvent);

		System.out.println("calendar after adding event" + calendar);

		eventService.save(creatorsEvent);
		calendarService.save(calendar);

		TimeSlotResponse response = new TimeSlotResponse(slotToRemove.getId(), slotToRemove.getStartTime(),
				slotToRemove.getEndTime(), slotToRemove.getAppdates().getDate(), selectedBy.getName(),
				selectedBy.getEmail());

		return new APIresponse(HttpStatus.GONE.value(), "User has selected the timeslot.", response);
	}

	@PostMapping(path = "/sendToCalendar/{appointmentId}", produces = "application/json")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")

	public APIresponse sendToCalendar(@Valid @PathVariable("appointmentId") long id) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User currentUser = userService.findByUsername(username);

		Appointment appointment = appointmentService.findById(id);

		if (appointment == null) {
			throw new ResourceAccessException("There is no appointment with id " + id + " in the database");
		}

		List<TimeSlots> timeSlots = timeSlotsService.findAllByAppointment(appointment);

		List<Event> eventList = new ArrayList<Event>();

		Calendar calendar = calendarService.findByNameAndCreatedBy("Appointment", currentUser);

		System.out.println(appointment);

		for (TimeSlots slot : timeSlots) {

			AppointmentDate appointmentDate = slot.getAppdates();

			String startTime = appointmentDate.getDate() + " " + slot.getStartTime();
			System.out.println(startTime);

			String endTime = appointmentDate.getDate() + " " + slot.getEndTime();
			System.out.println(endTime);

			Event event = new Event(appointment.getName(), appointment.getDescription(), appointment.getLocation(),

					null, startTime, endTime, currentUser, false, calendar.getColor(), "", slot.getId());


			eventList.add(event);
			System.out.println(event);
			eventService.save(event);
			calendar.addEvent(event);
			calendarService.save(calendar);
		}

		return new APIresponse(HttpStatus.CREATED.value(), "Appointment has been successfully saved to calendar",
				eventList);

	}

	
	// sends all the timeslots to admin/creator of appointment that are already selected by receipients 
	@SuppressWarnings("unused")
	@GetMapping(path = "/getScheduledAppointmentsForAdmin", produces = "application/json") 
	@PreAuthorize("hasRole('ADMIN') or hasRole('PM')")
	public APIresponse scheduledAppointmentsByUser() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = "";
		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}
		User currentUser = userService.findByUsername(username);

		List<TimeSlots> allSlotsFromAppointment = new ArrayList<TimeSlots>();
		List<Appointment> allAppointments = new ArrayList<Appointment>();
		allAppointments = appointmentService.findAllByCreatedBy(currentUser);
		
		if (allAppointments == null)
		{
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "You have not created any appointment! Please create appointment and assign appointees!",
					null);
		}
		else
		{
			for (Appointment app : allAppointments) {
				allSlotsFromAppointment.addAll(timeSlotsService.findAllByAppointment(app));
			}
	
			List<TimeSlotResponse> slotResponses = new ArrayList<TimeSlotResponse>();
			for (TimeSlots slots : allSlotsFromAppointment) {
				if (slots.getSelectedBy() != null) {
					slotResponses.add(new TimeSlotResponse(slots.getId(), slots.getStartTime(), slots.getEndTime(),
							slots.getAppdates().getDate(), slots.getSelectedBy().getName(),
							slots.getSelectedBy().getEmail(), slots.getAppointment().getName(),
							slots.getAppointment().getDescription(), slots.getAppointment().getCreatedBy().getName()));
				}
			}
			
			if (slotResponses == null)
			{
				return new APIresponse(HttpStatus.OK.value(), "Appointment reciepient has not selected their choices of timeslot for created appointments! Wait before schduled Appointments can be seen",
						null);
			}
			else
			{
				return new APIresponse(HttpStatus.OK.value(), "All  selected time slots from appointments successfully sent.",
						slotResponses);
			}
		
			
		}

	}

	@GetMapping(path = "/getScheduledAppointmentsForUsers", produces = "application/json")
	@PreAuthorize("hasRole('USER') or hasRole('PM') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public APIresponse scheduledAppointments() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = "";
		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}
		User currentUser = userService.findByUsername(username);

		List<TimeSlots> allSlotsFromAppointment = new ArrayList<TimeSlots>();
		for (Appointment app : appointmentService.findAllByRecepients(currentUser)) {
			allSlotsFromAppointment.addAll(timeSlotsService.findAllByAppointment(app));
		}

		List<TimeSlotResponse> slotResponses = new ArrayList<TimeSlotResponse>();
		for (TimeSlots slots : allSlotsFromAppointment) {
			if (slots.getSelectedBy() == currentUser) {
				slotResponses.add(new TimeSlotResponse(slots.getId(), slots.getStartTime(), slots.getEndTime(),
						slots.getAppdates().getDate(), slots.getSelectedBy().getName(),
						slots.getSelectedBy().getEmail(), slots.getAppointment().getName(),
						slots.getAppointment().getDescription(), slots.getAppointment().getCreatedBy().getName()));
			}
		}
		return new APIresponse(HttpStatus.OK.value(), "All  selected time slots from appointments successfully sent.",
				slotResponses);

	}
	
	@PutMapping(path = "/edit/{id}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse editAppointment(@Valid @RequestBody AppointmentEdit appointmentEdit, @PathVariable("id") Long groupId) {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Appointment appointment = appointmentService.findById(groupId);

		if (appointment == null) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Group with id " + groupId + " does not exist",
					null);
		}

		if (appointment.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the group. Authorization denied!",
					null);
		}

		appointment.setName(appointmentEdit.getName());
		appointment.setDescription(appointmentEdit.getDescription());
		appointment.setLocation(appointmentEdit.getLocation());
		
		List<TimeSlots> timeSlots = timeSlotsService.findAllByAppointment(appointment);
		List<String> editedEmails = appointmentEdit.getRecepients();
		
		List<User> newRecipients = new ArrayList<>();
		List<User> oldRecipients = appointment.getRecepients();
		
		List<User> deletedUsers = new ArrayList<User>();
		List<String>deletedUserEmail = new ArrayList<String>();
		
		List<User> addedUsers = new ArrayList<User>();
		List<String>addedUserEmail = new ArrayList<String>();
		
		int timeSlotCounter = timeSlots.size();
		
		int recipientsCounter = editedEmails.size();
		
		if(recipientsCounter > timeSlotCounter) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "The number of recipients exceeds the number of timeslots. Please remove one or more recipients.",
					null);
		}
		
		for(String email:editedEmails) {
			
			User newRecipientUser = userService.findByEmail(email);
			
			if (newRecipientUser != null) {
				newRecipients.add(newRecipientUser);
				if(!oldRecipients.contains(newRecipientUser)) {
					addedUsers.add(newRecipientUser);
				}
			}
		}
		
		for(User oldRecipient: oldRecipients) {
			if(!newRecipients.contains(oldRecipient)) {
				deletedUsers.add(oldRecipient);
				for(TimeSlots slots: timeSlots) {
					if(slots.getSelectedBy() == oldRecipient) {
						return new APIresponse(HttpStatus.FORBIDDEN.value(), "This user has already selected a time slot from "+slots.getStartTime()+" to "+slots.getEndTime()+". You cannot remove this person from the appointment.",
								null);
					}
				}
				
			}
		}
		
		for(User newUser:addedUsers) {
			addedUserEmail.add(newUser.getEmail());
			appointment.getRecepients().add(newUser);
		}
		
		for(User oldUser: deletedUsers) {
			deletedUserEmail.add(oldUser.getEmail());
			appointment.getRecepients().remove(oldUser);
		}
		
		appointmentService.save(appointment);
		
		for(TimeSlots slots: timeSlots) {
			Event event = eventService.findByTimeSlotId(slots.getId());
			event.setTitle(appointmentEdit.getName());
			event.setDescription(appointment.getDescription());
			event.setLocation(appointment.getLocation());
			eventService.save(event);
		}
		
		if (!addedUserEmail.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = addedUserEmail.toArray(new String[addedUserEmail.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Appointment Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText(
					"A faculty has set an appointment named " + appointment.getName()
							+ " for you. Please log in to you ULM communication app and register for the appointment. "
							+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}
		
		if (!deletedUserEmail.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = deletedUserEmail.toArray(new String[deletedUserEmail.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Appointment Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText(
					"A faculty has cancelled an appointment with name "+appointment.getName()+" Please disregard the previous email."
							+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}

		return new APIresponse(HttpStatus.OK.value(), "Appointment has been successfully edited", appointment);
	}
	
	@DeleteMapping(path = "/delete/{id}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse deleteAppointment(@PathVariable("id") Long appointmentId) {
		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User user = userService.findByUsername(username);

		Appointment appointment = appointmentService.findById(appointmentId);
		
		if (appointment == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(), "Appointment with id " + appointmentId + " does not exists.", null);
		}

		if (appointment.getCreatedBy() != user) {
			return new APIresponse(HttpStatus.FORBIDDEN.value(), "You did not create the appointment. Authorization denied!",
					null);
		}
		
		List<User> recipientsList = appointment.getRecepients();
		List<String> recipientsEmailList = new ArrayList<String>();
		
		for(User recipient: recipientsList) {
			recipientsEmailList.add(recipient.getEmail());
		}
		
		System.out.println("Recipients list: "+recipientsList);
				
		appointmentService.delete(appointment);
		
		if (!recipientsEmailList.isEmpty()) {

			SimpleMailMessage mailMessage = new SimpleMailMessage();

			String[] emails = recipientsEmailList.toArray(new String[recipientsEmailList.size()]);

			mailMessage.setTo(emails);
			mailMessage.setSubject("Appointment Information");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText(
					"A faculty has cancelled an appointment with name "+appointment.getName()+" Please disregard the previous email."
							+ "Thank you!");

			emailSenderService.sendEmail(mailMessage);
		}
		
		return new APIresponse(HttpStatus.OK.value(), "Appointment was successfully deleted.",appointment);
	}

}
