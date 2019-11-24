package com.csci4060.app.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.csci4060.app.ExceptionResolver;
import com.csci4060.app.configuration.fileStorage.FileStorageProperties;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.EmailWrapper;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.User;
import com.csci4060.app.model.UserDetailDummy;
import com.csci4060.app.model.major.Course;
import com.csci4060.app.model.major.Major;
import com.csci4060.app.services.CourseService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.FileReadService;
import com.csci4060.app.services.FileStorageService;
import com.csci4060.app.services.MajorService;
import com.csci4060.app.services.RoleService;
import com.csci4060.app.services.UserService;
import com.sun.mail.iap.Response;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/admin", produces = "application/json")
public class AdminController extends ExceptionResolver {

	@Value("${file.upload-Dir}")
	String uploadDir;

	@Autowired
	FileStorageProperties fileStorageProperties;

	@Autowired
	UserService userService;

	@Autowired
	RoleService roleService;

	@Autowired
	EmailSenderService emailSenderService;

	@Autowired
	MajorService majorService;

	@Autowired
	FileReadService fileReadService;

	@Autowired
	CourseService courseService;

	@Autowired
	FileStorageService fileStorageService;

	@Autowired
	ServletContext context;

	@PutMapping(path = "/changeRole")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse changeRoles(@Valid @RequestBody List<UserDetailDummy> userDetail) {
		List<UserDetailDummy> userWithChangedRoles = new ArrayList<UserDetailDummy>();
		for (UserDetailDummy details : userDetail) {
			User user = userService.findByEmail(details.getEmail());

			Role userRole = roleService.findByName(details.getRoles());

			user.getRoles().clear();
			user.getRoles().add(userRole);

			userService.save(user);

			userWithChangedRoles.add(
					new UserDetailDummy(user.getName(), user.getEmail(), user.getRoles().iterator().next().getName()));

		}
		return new APIresponse(HttpStatus.OK.value(),
				"The privileges allowed by chosen roles has been given to the User", userWithChangedRoles);

	}

	@GetMapping(path = "/getAllUsers")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse getAllUsers() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String username = "";

		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}

		User loggedIn = userService.findByUsername(username);
		List<User> allUsers = userService.findAllUserExcept(loggedIn.getEmail());

		List<UserDetailDummy> response = new ArrayList<UserDetailDummy>();
//	    RoleName rolename = "ROLE_USER";

		for (User users : allUsers) {

			response.add(new UserDetailDummy(users.getName(), users.getEmail(),
					users.getRoles().iterator().next().getName()));
		}

		return new APIresponse(HttpStatus.OK.value(), "All users in the system are provided", response);
	}

	@DeleteMapping(path = "/deleteUser")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse deleteUser(@RequestBody EmailWrapper emailWrapper) {

		List<String> emails = emailWrapper.getEmails();

		for (String email : emails) {
			User user = userService.findByEmail(email);

			if (user != null) {
				userService.delete(user);

				SimpleMailMessage mailMessage = new SimpleMailMessage();

				mailMessage.setTo(user.getEmail());
				mailMessage.setSubject("User Removed");
				mailMessage.setFrom("ulmautoemail@gmail.com");
				mailMessage.setText("You have been removed from the ulm communication app. " + "Thank you!");

				emailSenderService.sendEmail(mailMessage);
			}

		}

		return new APIresponse(HttpStatus.OK.value(), "User was successfully deleted.", emails);
	}

	@PostMapping(path = "/uploadMajor")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse uploadMajor() {
		List<String> majors = Arrays.asList("Accounting", "Agribusiness", "Art", "Atmospheric Science", "Biology",
				"Business", "Communication", "Computer Information Systems", "Computer Science",
				"Construction Management", "Counseling", "Criminal Justice", "Dental Hygiene",
				"Education: Curriculum and Instruction", "Educational Leadership", "English", "Finance",
				"General Studies", "Gerontology", "Health Studies", "History", "Kinesiology", "Management", "Marketing",
				"Marriage & Family Therapy", "Mathematics", "Medical Laboratory Science", "Music", "Nursing",
				"Occupational Therapy", "Pharmacy", "Political Science", "Psychology", "Radiologic Technology",
				"Risk Management & Insurance", "Social Work", "Speech-Language Pathology", "Toxicology",
				"Unmanned Aircraft Systems Management", "World Langauges: French", "World Langauges: Spanish");

		for (String major : majors) {

			Major majorObject = majorService.findByName(major);

			if (majorObject == null) {

				Major newMajor = new Major(major, null);
				majorService.save(newMajor);
			}
		}

		return new APIresponse(HttpStatus.CREATED.value(), "All majors have been successfully added.", majors);
	}

	@PostMapping(path = "/uploadCourses")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse uploadCourse(@RequestParam("file") MultipartFile file, @RequestParam("major") String majorName) {

		Major major = majorService.findByName(majorName);

		if (major == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(),
					"No major with name " + majorName + " found in the database", null);
		}

		try {
			List<Course> courses = fileReadService.readFileForCourse(file);

			if (courses == null) {
				return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Please check that the excel file is not empty.",
						null);
			} else {

				for (Course course : courses) {

					if (courseService.findByTitleAndDescription(course.getTitle(), course.getDescription()) == null) {
						courseService.save(course);
						major.getCourses().add(course);
					}
				}
				majorService.save(major);

			}

		} catch (IOException e) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(),
					"IO exception was caught. Please check cells are not empty and you're uploading sheet1 from excel file.",
					null);
		}
		return new APIresponse(HttpStatus.OK.value(), "All courses added to major " + major.getName(), major);

	}

	@PostMapping("/uploadImages")
	@PreAuthorize("hasRole('ADMIN')")
	public APIresponse uploadImages(@RequestParam("file") MultipartFile[] files) {

		String filesPath = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize().toString();

		File fileFolder = new File(filesPath);

		if (fileFolder != null) {

			File[] filesToRemove = fileFolder.listFiles();

			for (File file : filesToRemove) {
				file.delete();
			}

		}
		List<String> uploadedFiles = new ArrayList<String>();

		for (int i = 0; i < files.length; i++) {
			String fileName = fileStorageService.storeFile(files[i]);
			uploadedFiles.add(fileName);
		}

		return new APIresponse(HttpStatus.OK.value(), "Files were succesfully uploaded", uploadedFiles);
	}

	@GetMapping("/getImages")
	@PreAuthorize("hasRole('ADMIN')")
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

	@GetMapping("/getImagesDirectly")
	@PreAuthorize("hasRole('ADMIN')")
	public List<ResponseEntity<Resource>> getImagesDirectly(HttpServletRequest request) {

		List<ResponseEntity<Resource>> responseEntities = new ArrayList<ResponseEntity<Resource>>();

		List<String> images = new ArrayList<String>();

		String filesPath = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize().toString();
		System.out.println("File path is " + filesPath);

		File fileFolder = new File(filesPath);

		if (fileFolder != null) {
			for (final File file : fileFolder.listFiles()) {

				images.add(StringUtils.cleanPath(file.getName()));

				System.out.println("File name is  " + file.getName());
			}

			for (String image : images) {

				String contentType = null;
				Resource resource = null;

				try {
					resource = fileStorageService.loadFileAsResource(image);
				} catch (FileNotFoundException e) {
					System.out.println("No file with name: " + image);
				}

				try {
					contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
				} catch (IOException ex) {
					System.out.println("Could not determine file type of : " + image);
				}

				if (contentType == null) {
					contentType = "application/octet-stream";
				}

				responseEntities.add(ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
						.header(HttpHeaders.CONTENT_DISPOSITION,
								"attachment; filename=\"" + resource.getFilename() + "\"")
						.body(resource));
			}
		}
		return responseEntities;
	}

	@GetMapping("/getallfiles")
	  public ResponseEntity<List<String>> getListFiles(Model model) {
		List<String> files = new ArrayList<String>();
		
		String filesPath = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize().toString();
		
		File fileFolder = new File(filesPath);
		
		if(fileFolder != null) {
			for(final File file : fileFolder.listFiles()) {
				
				files.add(file.getName());
			}
		}
	 
	    return ResponseEntity.ok().body(files);
	  }

	@GetMapping("/files/{fileName:.+}")
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
