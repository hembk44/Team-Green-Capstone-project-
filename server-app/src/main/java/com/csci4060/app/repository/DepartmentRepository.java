package com.csci4060.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long>{

	
}
