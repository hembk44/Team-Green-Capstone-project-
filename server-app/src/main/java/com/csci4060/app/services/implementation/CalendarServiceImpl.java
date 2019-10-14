package com.csci4060.app.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.csci4060.app.model.User;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.repository.calendarRepo.CalendarRepository;
import com.csci4060.app.services.CalendarService;

@Service(value = "calendarService")
public class CalendarServiceImpl implements CalendarService {

	@Autowired
	CalendarRepository calendarRepo;

	@Override
	public Calendar save(Calendar calendar) {
		return calendarRepo.save(calendar);
	}

	@Override
	public Calendar findById(Long id) {

		Optional<Calendar> optCalendar = calendarRepo.findById(id);

		if (optCalendar.isPresent()) {
			return optCalendar.get();
		}
		return null;
	}

	@Override
	public List<Calendar> findAllByCreatedBy(User user) {

		Optional<List<Calendar>> optCalendarList = calendarRepo.findAllByCreatedBy(user);

		if (optCalendarList.isPresent()) {
			return optCalendarList.get();
		}
		return null;
	}

	@Override
	public List<Calendar> findAllByShareduser(User user) {
		Optional<List<Calendar>> optCalendarList = calendarRepo.findAllByShareduser(user);

		if (optCalendarList.isPresent()) {
			return optCalendarList.get();
		}
		return null;
	}

}
