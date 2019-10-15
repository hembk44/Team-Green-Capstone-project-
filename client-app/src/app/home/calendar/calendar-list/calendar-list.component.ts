import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { Calendar } from './calendar.model';
import { EventService } from '../events.service';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.css']
})
export class CalendarListComponent implements OnInit {

  calendars: any[];//list of calendars

  constructor(private calendarService: CalendarService,
    private eventService: EventService, 
    private dataStorage: DataStorageService) { }

  ngOnInit() {
    this.dataStorage.fetchCalendars();
    this.dataStorage.isLoading.subscribe(loading =>  {
      if(!loading){
        this.calendars = this.calendarService.getCalendars();
      }
    })//gets calendars from service
    console.log(this.calendars);
  }

  //toggle view of calendars
  // toggleCalendar(cal: Calendar){
  //   this.calendarService.toggleCalendar(cal);
  // }

}
