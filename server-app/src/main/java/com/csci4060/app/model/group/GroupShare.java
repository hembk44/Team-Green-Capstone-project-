package com.csci4060.app.model.group;

import java.util.List;

import lombok.Data;

@Data
public class GroupShare {

	private long id;
	private List<String> emails;
}
