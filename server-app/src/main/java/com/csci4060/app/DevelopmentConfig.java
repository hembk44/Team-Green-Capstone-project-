//package com.csci4060.app;
//
//import java.util.HashSet;
//import java.util.Set;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import com.csci4060.app.model.Role;
//import com.csci4060.app.model.RoleName;
//import com.csci4060.app.model.User;
//import com.csci4060.app.model.calendar.Calendar;
//import com.csci4060.app.repository.RoleRepository;
//import com.csci4060.app.repository.UserRepository;
//import com.csci4060.app.repository.calendarRepo.CalendarRepository;
//
//@Configuration
//public class DevelopmentConfig {
//
//	@Bean
//	public CommandLineRunner dataLoader(RoleRepository roleRepository, UserRepository userRepository, CalendarRepository calendarRepository) {
//		return new CommandLineRunner() {
//			@Override
//			public void run(String... args) throws Exception {
//				
//				roleRepository.save(new Role(RoleName.ROLE_USER));
//				roleRepository.save(new Role(RoleName.ROLE_PM));
//				roleRepository.save(new Role(RoleName.ROLE_ADMIN));
//				
////				Set<Role> role = new HashSet<>();
////				Role userRole = roleRepository.findByName(RoleName.ROLE_ADMIN).get();
////				role.add(userRole);
////				
////				User user = new User("Rohan Maharjan","Rohan9841@gmail.com","Rohan9841@gmail.com","capstone",true);
////				user.setRoles(role);
////				
////				calendarRepository.save(new Calendar("Main","#800029", null, null, user, true, true));
////				calendarRepository.save(new Calendar("Appointment","#800029", null, null, user, true, true));
////				calendarRepository.save(new Calendar("Shared Event","#800029", null, null, user, true, true));
////				
////				userRepository.save(user);
//			}
//		};
//	}
//}
