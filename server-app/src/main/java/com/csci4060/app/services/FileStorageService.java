package com.csci4060.app.services;

import java.io.FileNotFoundException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

	String storeFile(MultipartFile file);
	
	Resource loadFileAsResource(String fileName) throws FileNotFoundException;
}
