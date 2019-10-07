package com.csci4060.app.services;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.csci4060.app.model.User;

public interface FileReadService {

	List<User> readFile(MultipartFile file) throws IOException;
}
