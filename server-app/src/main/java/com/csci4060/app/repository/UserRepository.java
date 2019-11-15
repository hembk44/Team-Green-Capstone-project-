package com.csci4060.app.repository;

<<<<<<< HEAD
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.Role;
=======
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import com.csci4060.app.model.User;

public interface UserRepository extends JpaRepository<User, String>{

	Optional<User> findByEmailIgnoreCase(String email);
	Optional<User> findByUsername(String username);
<<<<<<< HEAD
	List<User> findAll();
	Optional<User> findById(Long id);
	Boolean existsByUsername(String username);
	Boolean existsByEmailIgnoreCase(String email);


	Optional<List<User>> findAllByRoles(Set<Role>roles);
}

=======
	Optional<User> findById(Long id);
	Boolean existsByUsername(String username);
	Boolean existsByEmailIgnoreCase(String email);
}
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
