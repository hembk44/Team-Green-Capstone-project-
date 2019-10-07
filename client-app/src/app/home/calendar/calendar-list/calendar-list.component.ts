import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { Calendar } from './calendar.model';
import { EventService } from '../events.service';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.css']
})
export class CalendarListComponent implements OnInit {

  private calendars: Calendar[];//list of calendars

  constructor(private calendarService: CalendarService,
    private eventService: EventService) { }

  ngOnInit() {
    this.calendars = this.calendarService.getCalendars();//gets calendars from service
    //   {
    //     user: 'moorea1',
    //     name: 'main',
    //     createdBy: 'moorea1',
    //     shown:true
    //   },
    //   {
    //       user: 'moorea1',
    //       name: 'appointments',
    //       createdBy: 'moorea1',
    //       shown:true
    //   },
    //   {
    //       user: 'moorea1',
    //       name: 'CSCI4060',
    //       createdBy: 'moorea1',
    //       shown: true
    //   }
    // ];
  }

  //toggle view of calendars
  toggleCalendar(index: number){
    this.calendars[index].shown = !this.calendars[index].shown;
    this.calendarService.setCalendars(this.calendars);
    this.eventService.updateEvents();
  }

}
