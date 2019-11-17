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
import com.csci4060.app.model.authentication.UserPrinciple;
import com.csci4060.app.repository.UserRepository;
import com.csci4060.app.services.UserService;


/*
 *  UserDetailsServiceImpl implements UserDetailsService and overrides loadUserByUsername() method.
 *  loadUserByUsername method finds a record from users database tables to build a UserDetails object
 *  for authentication.
 */
@Service (value = "userService")
public class UserDetailsServiceImpl implements UserDetailsService, UserService {

	@Autowired
	UserRepository userRepo;
	
	@Autowired
	PasswordEncoder encoder;

	@Override
	@Transactional
	// UserPrinciple implements UserDetails so returning UserPrinciple doesn't cause
	// any problems
	public UserDetails loadUserByUsername(String username){
		
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
		if(optUser.isPresent()) {
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

}
