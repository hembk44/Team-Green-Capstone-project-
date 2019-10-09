package com.csci4060.app.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.UploadFileResponse;
import com.csci4060.app.model.User;
import com.csci4060.app.services.FileReadService;
import com.csci4060.app.services.FileStorageService;
import com.csci4060.app.services.UserService;

@RestController
@RequestMapping("api/file")
public class FileController {

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);

	@Autowired
	private FileStorageService fileStorageService;

	@Autowired
	FileReadService fileReadService;
	
	@Autowired
	UserService userService;
	
	@PostMapping("/uploadFile")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public APIresponse uploadFile(@RequestParam("file") MultipartFile file) throws IOException {

		String fileName = fileStorageService.storeFile(file);

		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/file/downloadFile/")
				.path(fileName).toUriString();
		
		List<User> students = fileReadService.readFile(file);
		
		for(User user: students) {
			if(!userService.existsByUsername(user.getUsername())) {
				userService.save(user);
			}
		}
		
		UploadFileResponse response = new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(),
				file.getSize());

		return new APIresponse(HttpStatus.OK.value(), "File was succesfully uploaded", response);
	}

//	@PostMapping("/uploadMultipleFiles")
	//@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
//	public List<APIresponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
//		List<UploadFileResponse> responses = Arrays.asList(files)
//				.stream().map(file -> uploadFile(file))
//				.collect(Collectors.toList());
//		
//		return new APIresponse(HttpStatus.OK.value(), "Files were succesfully uploaded", responses);
//	}

	@GetMapping("/downloadFile/{fileName:.+}")
	@PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request)
			throws FileNotFoundException {

		// Load file as Resource
		Resource resource = fileStorageService.loadFileAsResource(fileName);

		// Try to determine file's content type
		String contentType = null;
		try {
			contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
		} catch (IOException ex) {
			logger.info("Could not determine file type.");
		}

		// Fallback to the default content type if type could not be determined
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
}
