package com.csci4060.app.services.implementation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.configuration.fileStorage.FileReadException;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.User;
import com.csci4060.app.services.FileReadService;
import com.csci4060.app.services.RoleService;

@Service(value = "fileReadService")
public class FileReadServiceImpl implements FileReadService {

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	RoleService roleService;
	@Override
	public List<User> readFile(MultipartFile file) throws IOException {
		@SuppressWarnings("resource")
		XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
		XSSFSheet worksheet = workbook.getSheetAt(0);

		if (isSheetFull(worksheet) == true) {
			// check cell name before writing the following code
			List<User> students = new ArrayList<User>();

			Set<Role> role = new HashSet<>();

			Role userRole = roleService.findByName(RoleName.ROLE_USER);

			role.add(userRole);

			for (int i = 1; i <= worksheet.getLastRowNum(); i++) {

				XSSFRow row = worksheet.getRow(i);

				if (isRowEmpty(row) == false) {

					String password = RandomStringUtils.random(8, true, true);
					System.out.println(password);

					String name = "";
					String username = "";
					String email = "";
					
					if (!row.getCell(0).getStringCellValue().isEmpty() && !row.getCell(1).getStringCellValue().isEmpty()
							&& !row.getCell(5).getStringCellValue().isEmpty()) {
						
						name = row.getCell(0).getStringCellValue() + " " + row.getCell(1).getStringCellValue().toString();
						username = row.getCell(5).getStringCellValue().toString();
						email = row.getCell(5).getStringCellValue().toString();
						User student = new User(name, username, email, password, true);

						student.setRoles(role);

						students.add(student);
					} else {
						throw new FileReadException("First name, last name and email must not be empty.");
					}
				}
			}
			return students;
		}

		return null;
	}

	public boolean isSheetFull(XSSFSheet worksheet) {
		Iterator<?> rows = worksheet.rowIterator();
		while (rows.hasNext()) {
			XSSFRow row = (XSSFRow) rows.next();
			Iterator<?> cells = row.cellIterator();
			while (cells.hasNext()) {
				XSSFCell cell = (XSSFCell) cells.next();
				if (!cell.getStringCellValue().isEmpty()) {
					return true;
				}
			}
		}
		return false;
	}

	public boolean isRowEmpty(XSSFRow row) {
		if (row == null || row.getLastCellNum() <= 0) {
			return true;
		}
		XSSFCell cell = row.getCell((int) row.getFirstCellNum());
		if (cell == null || "".equals(cell.getRichStringCellValue().getString())) {
			return true;
		}
		return false;
	}

}
