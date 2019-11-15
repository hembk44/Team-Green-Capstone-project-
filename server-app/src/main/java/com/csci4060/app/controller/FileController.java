package com.csci4060.app.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
<<<<<<< HEAD
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
=======
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
<<<<<<< HEAD
=======
import org.springframework.web.bind.annotation.RequestBody;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

<<<<<<< HEAD
import com.csci4060.app.configuration.fileStorage.FileReadException;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.UploadFileResponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.FileReadService;
import com.csci4060.app.services.FileStorageService;
import com.csci4060.app.services.RoleService;
=======
import com.csci4060.app.ExceptionResolver;
import com.csci4060.app.configuration.fileStorage.FileReadException;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.UploadFileResponse;
import com.csci4060.app.model.User;
import com.csci4060.app.model.appointment.AppointmentDummy;
import com.csci4060.app.model.authentication.ConfirmationToken;
import com.csci4060.app.services.ConfirmationTokenService;

import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.services.CalendarService;

import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.FileReadService;
import com.csci4060.app.services.FileStorageService;
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
import com.csci4060.app.services.UserService;

@RestController
@RequestMapping("api/file")
<<<<<<< HEAD
public class FileController {
=======
public class FileController extends ExceptionResolver {
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);

	@Autowired
	private FileStorageService fileStorageService;

	@Autowired
	FileReadService fileReadService;

	@Autowired
	UserService userService;
<<<<<<< HEAD
	
	@Autowired
	RoleService roleService;
=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
<<<<<<< HEAD
=======
	ConfirmationTokenService confirmationTokenService;
	
	@Autowired
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
	PasswordEncoder encoder;

	@Autowired
	CalendarService calendarService;

<<<<<<< HEAD
	@PostMapping("/uploadUser/{roleParam}")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse uploadFile(@RequestParam("file") MultipartFile file, @PathVariable("roleParam") String roleParam) throws IOException {
=======
//	@PostMapping("/uploadStudents")
//	@PreAuthorize("hasRole('ADMIN')")
//	public APIresponse uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
//
//		String fileName = fileStorageService.storeFile(file);
//
//		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/file/downloadFile/")
//				.path(fileName).toUriString();
//
//		List<User> students = fileReadService.readFile(file);
//
//		List<String> newUsersEmailList = new ArrayList<>();
//
//		if (students != null) {
//
//			for (User user : students) {
//
//				if (!userService.existsByUsername(user.getUsername())) {
//					newUsersEmailList.add(user.getEmail());
//					userService.save(user);
//          
//					calendarService.save(new Calendar("Main", null, null, user, true, true));
//					calendarService.save(new Calendar("Appointment", null, null, user, true, true));
//					calendarService.save(new Calendar("Shared Event", null, null, user, true, true));
//
//				}
//			}
//
//			if (!newUsersEmailList.isEmpty()) {
//				SimpleMailMessage mailMessage = new SimpleMailMessage();
//
//				String[] newUsersEmailArray = newUsersEmailList.toArray(new String[newUsersEmailList.size()]);
//
//				mailMessage.setTo(newUsersEmailArray);
//				mailMessage.setSubject("Registration Complete");
//				mailMessage.setFrom("ulmautoemail@gmail.com");
//				mailMessage.setText(
//						"Congratulations! You have been successfully registered to ULM Communication App. Your "
//								+ "username is your warhawks email address and your password is your cwid. Please change your "
//								+ "password as soon as possible to secure your account. Click on the following link to login "
//								+ "to your account.");
//
//				emailSenderService.sendEmail(mailMessage);
//			}
//
//			UploadFileResponse response = new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(),
//					file.getSize());
//
//			return new APIresponse(HttpStatus.CREATED.value(), "File was succesfully uploaded", response);
//		}
//
//		throw new FileReadException("The file is empty. Please upload a new file.");
//
//	}

	@PostMapping("/uploadUsers/{roleParam}")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse uploadFile(@Valid @RequestParam("file") MultipartFile file, @Valid @PathVariable("roleParam") RoleName role) throws IOException {
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

		String fileName = fileStorageService.storeFile(file);

		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/file/downloadFile/")
				.path(fileName).toUriString();
<<<<<<< HEAD
		
		Set<Role> role = new HashSet<>();
		
		Role userRole = roleService.findByName(RoleName.ROLE_USER);
		
		if(roleParam.equalsIgnoreCase("faculty")) {
			userRole = roleService.findByName(RoleName.ROLE_PM);
		}
		
		else if(roleParam.equalsIgnoreCase("admin")) {
			userRole = roleService.findByName(RoleName.ROLE_ADMIN);
		}
		
		role.add(userRole);
		
		List<User> usersList = fileReadService.readFile(file, role);

		List<String> newUsersEmailList = new ArrayList<>();

		if (usersList != null) {

			for (User user : usersList) {
=======

		List<User> users = fileReadService.readFile(file, role);

		List<String> newUsersEmailList = new ArrayList<>();

		if (users != null) {

			for (User user : users) {
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

				if (!userService.existsByUsername(user.getUsername())) {
					newUsersEmailList.add(user.getEmail());
					userService.save(user);
<<<<<<< HEAD
					calendarService.save(new Calendar("Main", "#800029",null, null, user, true, true));
					calendarService.save(new Calendar("Appointment", "#800029",null, null, user, true, true));
					calendarService.save(new Calendar("Shared Event", "#800029",null, null, user, true, true));
=======
          
					calendarService.save(new Calendar("Main", null, null, user, true, true));
					calendarService.save(new Calendar("Appointment", null, null, user, true, true));
					calendarService.save(new Calendar("Shared Event", null, null, user, true, true));
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09

				}
			}

			if (!newUsersEmailList.isEmpty()) {
				SimpleMailMessage mailMessage = new SimpleMailMessage();

				String[] newUsersEmailArray = newUsersEmailList.toArray(new String[newUsersEmailList.size()]);

				mailMessage.setTo(newUsersEmailArray);
				mailMessage.setSubject("Registration Complete");
				mailMessage.setFrom("ulmautoemail@gmail.com");
				mailMessage.setText(
						"Congratulations! You have been successfully registered to ULM Communication App. Your "
								+ "username is your warhawks email address and your password is your cwid. Please change your "
								+ "password as soon as possible to secure your account. Click on the following link to login "
								+ "to your account.");

				emailSenderService.sendEmail(mailMessage);
			}

			UploadFileResponse response = new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(),
					file.getSize());

			return new APIresponse(HttpStatus.CREATED.value(), "File was succesfully uploaded", response);
		}

		throw new FileReadException("The file is empty. Please upload a new file.");

	}

<<<<<<< HEAD
//	@PostMapping("/uploadMultipleFiles")
	// @PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
//	public List<APIresponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
//		List<UploadFileResponse> responses = Arrays.asList(files)
//				.stream().map(file -> uploadFile(file))
//				.collect(Collectors.toList());
//		
//		return new APIresponse(HttpStatus.OK.value(), "Files were succesfully uploaded", responses);
//	}

=======
>>>>>>> fe9437d1d7ad3890fd7a6028eecafe8c96cc2c09
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

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
}
