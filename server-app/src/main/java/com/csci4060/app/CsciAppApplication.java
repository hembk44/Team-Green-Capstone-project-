package com.csci4060.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.csci4060.app.configuration.fileStorage.FileStorageProperties;

@SpringBootApplication

//Enables the ConfigurationProperties feature
@EnableConfigurationProperties({
	FileStorageProperties.class
})
public class CsciAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CsciAppApplication.class, args);
	}

}
