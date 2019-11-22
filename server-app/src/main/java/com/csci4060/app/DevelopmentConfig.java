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
//				roleRepository.save(new Role(RoleName.ROLE_MODERATOR));
//		
//				
//				
//			}
//		};
//	}
//}