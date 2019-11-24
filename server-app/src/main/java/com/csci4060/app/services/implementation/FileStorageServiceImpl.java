package com.csci4060.app.services.implementation;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.configuration.fileStorage.FileStorageException;
import com.csci4060.app.configuration.fileStorage.FileStorageProperties;
import com.csci4060.app.services.FileStorageService;

//service for storing files in the file system and retrieving them
@Service
public class FileStorageServiceImpl implements FileStorageService {

	private final Path fileStorageLocation;
	
	@Autowired
	public FileStorageServiceImpl(FileStorageProperties fileStorageProperties) {
		this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();

		try {
			Files.createDirectories(this.fileStorageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("Could not create the directory where the upload files will be stored", ex);
		}
	}

	@Override
	public String storeFile(MultipartFile file) {
		// Normalize filename
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());

		try {
			// check if the file's name contains invalid characters
			if (fileName.contains("..")) {
				throw new FileStorageException("Sorry! Filename contains invalid path sequence: " + fileName);
			} 
//			//check if the file is a xlsx type
//			else if (!(fileName.endsWith(".xlsx"))) {
//				throw new FileStorageException("Invalid file format. Please upload csv file");
//			}
			
//			else if(!(fileName.endsWith(".jpg") || fileName.endsWith(".JPG")) && !(fileName.endsWith(".png") || fileName.endsWith(".PNG"))) {
//				throw new FileStorageException("Invalid file format. Please upload .jpg or .png file");
//			}

			// Copy file to the target location (Replacing existing file with same name)
			Path targetLocation = this.fileStorageLocation.resolve(fileName);
			
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			
			return fileName;
		} catch (IOException ex) {
			throw new FileStorageException("Could not store file" + fileName + ". Please try again!", ex);
		}
	}

	@Override
	public Resource loadFileAsResource(String fileName) throws FileNotFoundException {
		try {
			Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists()) {
				return resource;
			} else {
				throw new FileNotFoundException("File not found: " + fileName);
			}
		} catch (MalformedURLException ex) {
			throw new FileNotFoundException("File not found: " + fileName + ". The error is: " + ex);
		}
	}
}
