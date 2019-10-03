//package com.csci4060.app;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import com.csci4060.app.model.Role;
//import com.csci4060.app.model.RoleName;
//import com.csci4060.app.repository.RoleRepository;
//
//@Configuration
//public class DevelopmentConfig {
//
//	@Bean
//	public CommandLineRunner dataLoader(RoleRepository roleRepository) {
//		return new CommandLineRunner() {
//			@Override
//			public void run(String... args) throws Exception {
//
//				roleRepository.save(new Role(RoleName.ROLE_USER));
//				roleRepository.save(new Role(RoleName.ROLE_PM));
//				roleRepository.save(new Role(RoleName.ROLE_ADMIN));
//
//			}
//		};
//	}
//}
