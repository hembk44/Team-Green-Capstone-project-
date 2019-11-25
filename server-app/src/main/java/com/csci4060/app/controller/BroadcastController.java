package com.csci4060.app.controller;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci4060.app.configuration.fileStorage.FileStorageProperties;
import com.csci4060.app.model.APIresponse;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/auth/", produces = "application/json")
public class BroadcastController {

	@Autowired
	FileStorageProperties fileStorageProperties;
	
	@GetMapping("/getImages")
	public APIresponse getImages() {
		List<String> images = new ArrayList<String>();

		String filesPath = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize().toString();
		System.out.println("File path is " + filesPath);

		File fileFolder = new File(filesPath);

		if (fileFolder != null) {
			for (final File file : fileFolder.listFiles()) {

				System.out.println("For loop has been reached " + file);
				if (!file.isDirectory()) {
					String encodedBase64 = null;
					try {
						String extension = FilenameUtils.getExtension(file.getName());
						FileInputStream fileInputStream = new FileInputStream(file);

						byte[] bytes = new byte[(int) file.length()];
						fileInputStream.read(bytes);

						encodedBase64 = Base64.getEncoder().encodeToString(bytes);
						images.add(encodedBase64);
						fileInputStream.close();
					} catch (Exception e) {
						return new APIresponse(HttpStatus.EXPECTATION_FAILED.value(),
								"Something went wrong. Please check the backend code.", null);
					}
				}
			}
		}
		return new APIresponse(HttpStatus.OK.value(), "Images are successfully sent", images);
	}
}
