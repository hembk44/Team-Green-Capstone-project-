import {
  Component,
  OnInit,
} from "@angular/core";
import {
  isSameMonth,
} from "date-fns";
import { CalendarEvent, CalendarView } from "angular-calendar";
import { CalEvent } from "./events.model";
import { EventService } from "./events.service";
import { Router } from "@angular/router";
import { CompatibleEvent } from './compatible-events.model';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {

  constructor(private router: Router, private dataStorage: DataStorageService, private eventService: EventService,private authService: AuthService) {}

  viewDate: Date;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;
  role = this.authService.user;

  calEvents: CalEvent[]=[];//list of events
  compatEvents: CompatibleEvent[]=[];
  apptEvents: any[] = [];

  ngOnInit() {
    this.viewDate = new Date();
    this.compatEvents = [];
    // this.dataStorage.fetchEvents();
    // this.dataStorage.isLoading.subscribe(loading=>{
    //   if(!loading){
    //       this.calEvents = this.dataStorage.eventsList;
    //       console.log(this.calEvents);
    //   }
    //   for(let event of this.calEvents){
    //     const dateString = event.eventdates[0].date.toString();
    //     const endString = event.eventdates[event.eventdates.length-1].date.toString();
    //     const startTimes = event.eventdates[0].eventtimes[0].startTime;
    //     const endTimes = event.eventdates[event.eventdates.length - 1].eventtimes[0].endTime;
    //     const ev = new CompatibleEvent(
    //       event.name,
    //       new Date(dateString.substring(5,7).concat('/').concat(dateString.substring(8,10)).concat('/').concat(dateString.substring(0,4)).concat(' ').concat(startTimes)),
    //       new Date(endString.substring(5,7).concat('/').concat(dateString.substring(8,10)).concat('/').concat(dateString.substring(0,4)).concat(' ').concat(endTimes)),
    //       event.id,
    //     )
    //     this.compatEvents.push(ev);
    //   } 
    // });
    //console.log(this.compatEvents);
    this.dataStorage.fetchUserAppointment();
    this.dataStorage.isLoading.subscribe(loading=>{
      if(!loading){
        console.log('getting shit from db');
        this.apptEvents = this.dataStorage.appointmentLists;
        console.log(this.apptEvents);
      }
      for(let appt of this.apptEvents){
        const title = appt.appointmentName;
        const id = appt.id
        const startTime = appt.startTime;
        const endTime = appt.endTime;
        const date = appt.date;
        const start = new Date(date.substring(5,7).concat('/').concat(date.substring(8,10)).concat('/').concat(date.substring(0,4)).concat(' ').concat(startTime));
        const end = new Date(date.substring(5,7).concat('/').concat(date.substring(8,10)).concat('/').concat(date.substring(0,4)).concat(' ').concat(endTime));
        const ev: CompatibleEvent = new CompatibleEvent(
          title,
          start,
          end
        );
        this.compatEvents.push(ev);
        console.log(ev);
      }
    })
    
    console.log(this.compatEvents);
  }

  //changes view of calendar to day, week, month
  setView(view: CalendarView) {
    this.view = view;
  }

  // changes view date for list of events
  dayClicked({ date, events }: { date: Date; events: CalEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
    }
  }

  eventClicked(event: CompatibleEvent) {
    console.log(event);
  }

  // navigates to event creation form
  createEvent() {
    this.router.navigate(["home/create-event"]);
  }
}
