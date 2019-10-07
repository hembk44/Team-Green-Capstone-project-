package com.csci4060.app.configuration.fileStorage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

//@ConfigurationProperties binds all the properties with prefix file to the corresponding fields in this class
@ConfigurationProperties(prefix = "file")
@Data
public class FileStorageProperties {

	@Value("${file.upload-Dir}")
	private String uploadDir;
}
