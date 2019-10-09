package com.csci4060.app.services.implementation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

		List<User> students = new ArrayList<User>();

		Set<Role> role = new HashSet<>();
		
		Role userRole = roleService.findByName(RoleName.ROLE_USER);
		
		role.add(userRole);
		
		for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) {

			XSSFRow row = worksheet.getRow(i);

			String password = RandomStringUtils.random(8,true,true);
			System.out.println(password);
			User student = new User(row.getCell(0).getStringCellValue() +" "+ row.getCell(1).getStringCellValue(),
					row.getCell(2).getStringCellValue(), row.getCell(5).getStringCellValue(),
					encoder.encode(password), true);
			
			student.setRoles(role);
			
			students.add(student);
		}
		return students;
	}

}
