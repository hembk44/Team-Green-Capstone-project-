package com.csci4060.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.User;

public interface UserRepository extends JpaRepository<User, String>{

	Optional<User> findByEmailIgnoreCase(String email);
	Optional<User> findByUsername(String username);
	Optional<User> findById(Long id);
	Boolean existsByUsername(String username);
	Boolean existsByEmailIgnoreCase(String email);
}
