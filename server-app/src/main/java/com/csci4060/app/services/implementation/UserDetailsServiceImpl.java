package com.csci4060.app.services.implementation;

import java.util.List;
<<<<<<< HEAD
import java.util.Optional;
import java.util.Set;
=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
<<<<<<< HEAD
=======
import org.springframework.security.core.userdetails.UsernameNotFoundException;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

<<<<<<< HEAD
import com.csci4060.app.model.Role;
=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import com.csci4060.app.model.User;
import com.csci4060.app.model.authentication.UserPrinciple;
import com.csci4060.app.repository.UserRepository;
import com.csci4060.app.services.UserService;

<<<<<<< HEAD

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
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
<<<<<<< HEAD
	public UserDetails loadUserByUsername(String username){
		
		Optional<User> optUser = userRepo.findByUsername(username);

		if (optUser.isPresent()) {
			return UserPrinciple.build(optUser.get());
		}
		return null;
=======
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByUsername(username).orElseThrow(
				() -> new UsernameNotFoundException("User not found with -> username or email: " + username));

		return UserPrinciple.build(user);
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	}

	@Override
	public List<User> findAll() {
		return userRepo.findAll();
	}
	
	@Override
	public User findByUsername(String username) {
<<<<<<< HEAD
		
		Optional<User> optUser = userRepo.findByUsername(username);

		if (optUser.isPresent()) {
			return optUser.get();
		}
		return null;
=======
		return userRepo.findByUsername(username)
				.orElseThrow(()->new UsernameNotFoundException("User not found with -> username: "+username));
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
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
<<<<<<< HEAD
		
		Optional<User> optUser = userRepo.findById(id);

		if (optUser.isPresent()) {
			return optUser.get();
		}
		return null;
=======
		return userRepo.findById(id)
				.orElseThrow(()->new UsernameNotFoundException("User not found"));
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	}

	@Override
	public User update(User user) {
<<<<<<< HEAD
		
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
=======
		User userFromDB = userRepo.findById(user.getId())
				.orElseThrow(()-> new UsernameNotFoundException("User not found"));
		userFromDB.setName(user.getName());
		userFromDB.setEmail(user.getEmail());
		userFromDB.setUsername(user.getUsername());
		userFromDB.setPassword(encoder.encode(user.getPassword()));
		return userFromDB;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	}

	@Override
	public User save(User user) {
		return userRepo.save(user);
	}
	
	@Override
	public void delete(String email) {
		
<<<<<<< HEAD
		Optional<User> optUser = userRepo.findByEmailIgnoreCase(email);

		if (optUser.isPresent()) {
			userRepo.delete(optUser.get());
		}
=======
		User user = userRepo.findByEmailIgnoreCase(email)
				.orElseThrow(()->new UsernameNotFoundException("User not found with -> email:"+email));
		userRepo.delete(user);
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	}

	@Override
	public Boolean existsByUsername(String username) {
		return userRepo.existsByUsername(username);
	}

	@Override
	public Boolean existsByEmail(String email) {
		return userRepo.existsByEmailIgnoreCase(email);
<<<<<<< HEAD

	}

	@Override
	public List<User> findAllByRoles(Set<Role> roles) {
		Optional<List<User>> optUser = userRepo.findAllByRoles(roles);

		if (optUser.isPresent()) {
			return optUser.get();
		}
		
		return null;

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	}

}
