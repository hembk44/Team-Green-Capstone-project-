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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.configuration.fileStorage.FileReadException;
import com.csci4060.app.model.Role;

import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.User;
import com.csci4060.app.model.authentication.ConfirmationToken;
import com.csci4060.app.services.ConfirmationTokenService;

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
