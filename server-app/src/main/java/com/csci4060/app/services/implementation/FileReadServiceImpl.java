package com.csci4060.app.services.implementation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.configuration.fileStorage.FileReadException;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.User;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.model.major.Course;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.FileReadService;
import com.csci4060.app.services.RoleService;
import com.csci4060.app.services.UserService;

@Service(value = "fileReadService")
public class FileReadServiceImpl implements FileReadService {

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	RoleService roleService;

	@Autowired
	UserService userService;

	@Autowired
	CalendarService calendarService;
	
	@Autowired
	EmailSenderService emailSenderService;

	@Override
	public List<User> readFile(MultipartFile file, Set<Role> userRole) throws IOException {

		@SuppressWarnings("resource")
		Workbook workbook = new XSSFWorkbook(file.getInputStream());
		Sheet worksheet = workbook.getSheetAt(0);

		DataFormatter formatter = new DataFormatter();

		if (isSheetFull(worksheet) == true) {
			// check cell name before writing the following code
			List<User> users = new ArrayList<User>();

			for (int i = 1; i <= worksheet.getLastRowNum(); i++) {

				Row row = worksheet.getRow(i);

				if (isRowEmpty(row) == false) {

					Cell firstNameCell = row.getCell(0);
					Cell lastNameCell = row.getCell(1);
					Cell usernameCell = row.getCell(5);
					Cell passwordCell = row.getCell(2);
					Cell emailCell = row.getCell(5);

					List<Cell> cellList = new ArrayList<>();
					cellList.add(firstNameCell);
					cellList.add(lastNameCell);
					cellList.add(usernameCell);
					cellList.add(passwordCell);
					cellList.add(emailCell);

					if (isCellEmpty(cellList) == false) {

						String name = formatter.formatCellValue(row.getCell(0)) + " "
								+ formatter.formatCellValue(row.getCell(1));
						String username = formatter.formatCellValue(row.getCell(5));
						String password = formatter.formatCellValue(row.getCell(2));
						String email = formatter.formatCellValue(row.getCell(5));

						User user = new User(name, username, email, encoder.encode(password), true);

						user.setRoles(userRole);

						users.add(user);
					} else {
						throw new FileReadException("First name, last name, cwid and email must not be empty.");
					}
				}
			}
			return users;
		}

		return null;
	}

	@Override
	public List<User> readFileForGroup(MultipartFile file) throws IOException {
		@SuppressWarnings("resource")
		Workbook workbook = new XSSFWorkbook(file.getInputStream());
		Sheet worksheet = workbook.getSheetAt(0);

		DataFormatter formatter = new DataFormatter();

		List<User> groupMembers = new ArrayList<User>();
		
		List<String> newUserEmail = new ArrayList<String>();

		Set<Role> role = new HashSet<>();

		Role userRole = roleService.findByName(RoleName.ROLE_USER);

		role.add(userRole);

		if (isSheetFull(worksheet) == true) {
			// check cell name before writing the following code

			for (int i = 1; i <= worksheet.getLastRowNum(); i++) {

				Row row = worksheet.getRow(i);

				if (isRowEmpty(row) == false) {

					Cell firstNameCell = row.getCell(0);
					Cell lastNameCell = row.getCell(1);
					Cell usernameCell = row.getCell(5);
					Cell passwordCell = row.getCell(2);
					Cell emailCell = row.getCell(5);

					List<Cell> cellList = new ArrayList<>();
					cellList.add(firstNameCell);
					cellList.add(lastNameCell);
					cellList.add(usernameCell);
					cellList.add(passwordCell);
					cellList.add(emailCell);

					if (isCellEmpty(cellList) == false) {

						String name = formatter.formatCellValue(row.getCell(0)) + " "
								+ formatter.formatCellValue(row.getCell(1));
						String username = formatter.formatCellValue(row.getCell(5));
						String password = formatter.formatCellValue(row.getCell(2));
						String email = formatter.formatCellValue(row.getCell(5));

						User user = userService.findByEmail(email);

						if (user == null) {
							
							newUserEmail.add(email);
							
							User newUser = new User(name, username, email, encoder.encode(password), true);
							newUser.setRoles(role);

							userService.save(newUser);
							calendarService.save(new Calendar("Main", "#800029", null, null, newUser, true, true));
							calendarService
									.save(new Calendar("Appointment", "#800029", null, null, newUser, true, true));
							calendarService
									.save(new Calendar("Shared Event", "#800029", null, null, newUser, true, true));

							groupMembers.add(newUser);
							
						} else {
							groupMembers.add(user);
						}
					} else {
						throw new FileReadException("First name, last name, cwid and email must not be empty.");
					}
				}
			}
			
			if (!newUserEmail.isEmpty()) {
				SimpleMailMessage mailMessage = new SimpleMailMessage();

				String[] newUsersEmailArray = newUserEmail.toArray(new String[newUserEmail.size()]);

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
			return groupMembers;
		}

		return null;
	}
	
	@Override
	public List<Course> readFileForCourse(MultipartFile file) throws IOException {
		@SuppressWarnings("resource")
		Workbook workbook = new XSSFWorkbook(file.getInputStream());
		Sheet worksheet = workbook.getSheetAt(0);

		DataFormatter formatter = new DataFormatter();

		List<Course> courses = new ArrayList<Course>();

		if (isSheetFull(worksheet) == true) {
			// check cell name before writing the following code

			for (int i = 1; i <= worksheet.getLastRowNum(); i++) {

				Row row = worksheet.getRow(i);

				if (isRowEmpty(row) == false) {

					Cell descriptionCell = row.getCell(0);
					Cell titleCell = row.getCell(1);

					List<Cell> cellList = new ArrayList<>();
					cellList.add(descriptionCell);
					cellList.add(titleCell);
		
					if (isCellEmpty(cellList) == false) {

						String description = formatter.formatCellValue(row.getCell(0));
						String title = formatter.formatCellValue(row.getCell(1));
						
						courses.add(new Course(title,description));
						
						System.out.println("Description is: "+description);
						System.out.println("Title is: "+title);
						
					} else {
						throw new FileReadException("Description and title must not be empty.");
					}
				}
			}
			return courses;
		}

		return null;
	}

	public boolean isSheetFull(Sheet worksheet) {
		Iterator<?> rows = worksheet.rowIterator();
		while (rows.hasNext()) {
			Row row = (Row) rows.next();
			Iterator<?> cells = row.cellIterator();
			while (cells.hasNext()) {
				Cell cell = (Cell) cells.next();
				if (!cell.getStringCellValue().isEmpty()) {
					return true;
				}
			}
		}
		return false;
	}

	public boolean isRowEmpty(Row row) {
		if (row == null || row.getLastCellNum() <= 0) {
			return true;
		}
		Cell cell = row.getCell((int) row.getFirstCellNum());
		if (cell == null || "".equals(cell.getRichStringCellValue().getString())) {
			return true;
		}
		return false;
	}

	public boolean isCellEmpty(List<Cell> cellList) {

		for (Cell cell : cellList) {
			if ((cell == null) || (cell.getCellType() == CellType.BLANK)
					|| (cell.getCellType() == CellType.STRING && cell.getStringCellValue().trim().isEmpty())) {
				return true;
			}
		}
		return false;
	}
}
