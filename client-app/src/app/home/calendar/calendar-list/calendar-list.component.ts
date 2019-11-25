import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { Calendar } from './calendar.model';
import { EventService } from '../events.service';
import { DataStorageService } from '../../shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.css']
})
export class CalendarListComponent implements OnInit {

  calendars: any[];//list of calendars
  sharedCals: any[];
  customCals: any[];
  username: string;

  constructor(private calendarService: CalendarService,
    private eventService: EventService, 
    private dataStorage: DataStorageService,
    private authService: AuthService) { }

  ngOnInit() {
    this.dataStorage.fetchCalendars();
    this.username = this.authService.name;
    this.dataStorage.isLoading.subscribe(loading =>  {
      if(!loading){
        this.calendars = this.calendarService.getCalendars().filter(cal => cal.defaultCalendar && cal.createdBy.email === this.username);
        this.customCals = this.calendarService.getCalendars().filter(cal => cal.createdBy.email === this.username && !cal.defaultCalendar);
        this.sharedCals = this.calendarService.getCalendars().filter(cal => cal.createdBy.email !== this.username);
        console.log(this.sharedCals);
      }
    })//gets calendars from service
  }

  //toggle view of calendars
  // toggleCalendar(cal: Calendar){
  //   this.calendarService.toggleCalendar(cal);
  // }

}
