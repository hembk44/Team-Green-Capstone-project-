package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csci4060.app.model.Role;
import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.Appointment;
import com.csci4060.app.model.appointment.TimeSlots;
import com.csci4060.app.model.authentication.UserPrinciple;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.model.event.Event;
import com.csci4060.app.model.group.Group;
import com.csci4060.app.repository.UserRepository;
import com.csci4060.app.services.AppointmentService;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EventService;
import com.csci4060.app.services.GroupService;
import com.csci4060.app.services.TimeSlotsService;
import com.csci4060.app.services.UserService;

/*
 *  UserDetailsServiceImpl implements UserDetailsService and overrides loadUserByUsername() method.
 *  loadUserByUsername method finds a record from users database tables to build a UserDetails object
 *  for authentication.
 */
@Service(value = "userService")
public class UserDetailsServiceImpl implements UserDetailsService, UserService {

	@Autowired
	UserRepository userRepo;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	CalendarService calendarService;

	@Autowired
	AppointmentService appointmentService;

	@Autowired
	EventService eventService;
	
	@Autowired
	GroupService groupService;

	@Autowired
	TimeSlotsService timeSlotsService;
	
	@Override
	@Transactional
	// UserPrinciple implements UserDetails so returning UserPrinciple doesn't cause
	// any problems
	public UserDetails loadUserByUsername(String username) {

		Optional<User> optUser = userRepo.findByUsername(username);

		if (optUser.isPresent()) {
			return UserPrinciple.build(optUser.get());
		}
		return null;
	}

	@Override
	public List<User> findAll() {
		return userRepo.findAll();
	}

	@Override
	public User findByUsername(String username) {

		Optional<User> optUser = userRepo.findByUsername(username);

		if (optUser.isPresent()) {
			return optUser.get();
		}
		return null;
	}

	@Override
	public User findByEmail(String email) {
		Optional<User> optUser = userRepo.findByEmailIgnoreCase(email);
		if (optUser.isPresent()) {
			return optUser.get();
		}
		return null;
	}

	@Override
	public User findById(Long id) {

		Optional<User> optUser = userRepo.findById(id);

		if (optUser.isPresent()) {
			return optUser.get();
		}
		return null;
	}

	@Override
	public User update(User user) {

		Optional<User> optUser = userRepo.findById(user.getId());

		if (optUser.isPresent()) {
			User userFromDB = optUser.get();
			userFromDB.setName(user.getName());
			userFromDB.setEmail(user.getEmail());
			userFromDB.setUsername(user.getUsername());
			userFromDB.setPassword(encoder.encode(user.getPassword()));
			return userFromDB;
		}
		return null;
	}

	@Override
	public User save(User user) {
		return userRepo.save(user);
	}

	@Override
	public void delete(String email) {

		Optional<User> optUser = userRepo.findByEmailIgnoreCase(email);

		if (optUser.isPresent()) {
			userRepo.delete(optUser.get());
		}
	}

	@Override
	public Boolean existsByUsername(String username) {
		return userRepo.existsByUsername(username);
	}

	@Override
	public Boolean existsByEmail(String email) {
		return userRepo.existsByEmailIgnoreCase(email);
	}

	@Override
	public List<User> findAllByRoles(Set<Role> roles) {
		Optional<List<User>> optUser = userRepo.findAllByRoles(roles);

		if (optUser.isPresent()) {
			return optUser.get();
		}

		return null;

	}

	@Override
	public List<User> findAllUserExcept(String userEmail) {
		Optional<List<User>> allUsers = userRepo.findAllByEmailNot(userEmail);

		if (allUsers.isPresent()) {
			return allUsers.get();
		}

		return null;
	}

	@Override
	public void delete(User user) {

		List<Appointment> createdAppointments = appointmentService.findAllByCreatedBy(user);

		if (createdAppointments != null) {
			for (Appointment appointment : createdAppointments) {
				appointmentService.delete(appointment);
			}
		}

		List<Appointment> receivedAppointments = appointmentService.findAllByRecepients(user);

		if (receivedAppointments != null) {
			for (Appointment appointment : receivedAppointments) {
				appointment.getRecepients().remove(user);
				
				List<TimeSlots> timeSlots = timeSlotsService.findAllByAppointment(appointment);
				
				for(TimeSlots slot: timeSlots) {
					if(slot.getSelectedBy() == user) {
						
						Event event = eventService.findByTimeSlotId(slot.getId());
						event.getConfirmedBy().remove(user);
						eventService.save(event);
						
						slot.setSelectedBy(null);
						timeSlotsService.save(slot);
					}
				}
				appointmentService.save(appointment);
			}
		}

		List<Event> createdEvents = eventService.findAllByCreatedBy(user);

		if (createdEvents != null) {
			for (Event event : createdEvents) {
				eventService.delete(event);
			}
		}

		List<Event> receivedEvents = eventService.findAllByRecepients(user);

		if (receivedEvents != null) {
			for (Event event : receivedEvents) {
				event.getRecipients().remove(user);

				if (event.getConfirmedBy().contains(user)) {
					event.getConfirmedBy().remove(user);
				}
				
				eventService.save(event);
			}
		}

		List<Calendar> createdCalendars = calendarService.findAllByCreatedBy(user);

		if (createdCalendars != null) {
			for (Calendar calendar : createdCalendars) {
				calendarService.delete(calendar);
			}
		}
		
		List<Calendar> receivedCalendars = calendarService.findAllByShareduser(user);
		
		if(receivedCalendars != null) {
			for(Calendar calendar: receivedCalendars) {
				calendar.getShareduser().remove(user);
				calendarService.save(calendar);
			}
		}
		
		List<Group> createdGroups = groupService.findAllByCreatedBy(user);
		
		if(createdGroups != null) {
			for(Group group: createdGroups) {
				groupService.delete(group);
			}
		}

		List<Group> ownedGroups = groupService.findAllByOtherOwners(user);
		
		if(ownedGroups != null) {
			for(Group group: ownedGroups) {
				group.getOtherOwners().remove(user);
				groupService.save(group);
			}
		}
		
		List<Group> memberGroups = groupService.findAllByMembers(user);
		
		if(memberGroups != null) {
			for (Group group: memberGroups) {
				System.out.println("Member group is: "+group.getId());
			}
		}
		
		
		if(memberGroups != null) {
			for(Group group: memberGroups) {
				System.out.println("Groups id: "+ group.getId()+". Groups members before saving: "+group.getMembers());
				group.removeMember(user);
				groupService.save(group);
				System.out.println("Groups members after saving: "+group.getMembers());
			}
		}
		
		user.getRoles().clear();
		
		System.out.println("User roles cleared:"+user.getRoles());
		userRepo.delete(user);
	}

}
