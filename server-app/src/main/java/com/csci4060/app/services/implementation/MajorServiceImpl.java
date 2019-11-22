package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.major.Major;
import com.csci4060.app.repository.majorRepo.MajorRepository;
import com.csci4060.app.services.MajorService;

@Service(value = "majorService")
public class MajorServiceImpl implements MajorService {

	@Autowired
	MajorRepository majorRepository;

	@Override
	public Major save(Major major) {
		return majorRepository.save(major);
	}

	@Override
	public Major findByName(String name) {
		Optional<Major> optMajor = majorRepository.findByNameIgnoreCase(name);

		if (optMajor.isPresent()) {
			return optMajor.get();
		}

		return null;
	}

	@Override
	public List<Major> findAll() {
		return majorRepository.findAll();
	}

}
