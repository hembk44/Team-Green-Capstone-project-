package com.csci4060.app.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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
import com.csci4060.app.services.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/file")
public class FileController {

	private static final Logger logger = LoggerFactory.getLogger(FileController.class);

	@Autowired
	private FileStorageService fileStorageService;

	@Autowired
	FileReadService fileReadService;

	@Autowired
	UserService userService;
	
	@Autowired
	RoleService roleService;

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	CalendarService calendarService;

	@PostMapping("/uploadUser/{roleParam}")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse uploadFile(@RequestParam("file") MultipartFile file, @PathVariable("roleParam") String roleParam) throws IOException {

//		String fileName = fileStorageService.storeFile(file);
//
//		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("api/file/downloadFile/")
//				.path(fileName).toUriString();
		
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

				if (userService.findByEmail(user.getEmail()) == null) {
					newUsersEmailList.add(user.getEmail());
					userService.save(user);
					calendarService.save(new Calendar("Main", "#800029",null, null, user, true, true));
					calendarService.save(new Calendar("Appointment", "#800029",null, null, user, true, true));
					calendarService.save(new Calendar("Shared Event", "#800029",null, null, user, true, true));

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

//			UploadFileResponse response = new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(),
//					file.getSize());

			return new APIresponse(HttpStatus.CREATED.value(), "File was succesfully uploaded", newUsersEmailList);
		}

		throw new FileReadException("The file is empty. Please upload a new file.");

	}

//	@PostMapping("/uploadMultipleFiles")
	// @PreAuthorize("hasRole('PM') or hasRole('ADMIN')")
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

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
}
