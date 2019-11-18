package com.csci4060.app;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.csci4060.app.model.APIresponse;


public class ExceptionResolver {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public APIresponse validationError(MethodArgumentNotValidException ex) {
	    BindingResult result = ex.getBindingResult();
	    FieldError fieldError = result.getFieldError();

	    return new APIresponse(HttpStatus.BAD_REQUEST.value(), fieldError.getDefaultMessage(), null );
	}

}
