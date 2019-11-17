package com.csci4060.app.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.Role;
import com.csci4060.app.model.User;

public interface UserRepository extends JpaRepository<User, String>{

	Optional<User> findByEmailIgnoreCase(String email);
	Optional<User> findByUsername(String username);
	List<User> findAll();
	Optional<User> findById(Long id);
	Boolean existsByUsername(String username);
	Boolean existsByEmailIgnoreCase(String email);
	Optional<List<User>> findAllByRoles(Set<Role>roles);
}
