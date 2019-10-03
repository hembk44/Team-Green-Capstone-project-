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

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {

  constructor(private router: Router, private dataStorage: DataStorageService, private eventService: EventService) {}

  viewDate: Date;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;

  calEvents: CalEvent[]=[];//list of events
  compatEvents: CompatibleEvent[]=[];

  ngOnInit() {
    this.viewDate = new Date();
    this.compatEvents = [];
    this.dataStorage.fetchEvents();
    this.dataStorage.isLoading.subscribe(loading=>{
      this.compatEvents = []
      if(!loading){
          this.calEvents = this.dataStorage.eventsList;
          console.log(this.calEvents);
      }
      for(let event of this.calEvents){
        const dateString = event.eventdates[0].date.toString();
        const endString = event.eventdates[event.eventdates.length-1].date.toString();
        const startTimes = event.eventdates[0].eventtimes[0].startTime;
        const endTimes = event.eventdates[event.eventdates.length - 1].eventtimes[0].endTime;
        const ev = new CompatibleEvent(
          event.id,
          event.name,
          new Date(dateString.substring(5,7).concat('/').concat(dateString.substring(8,10)).concat('/').concat(dateString.substring(0,4)).concat(' ').concat(startTimes)),
          new Date(endString.substring(5,7).concat('/').concat(dateString.substring(8,10)).concat('/').concat(dateString.substring(0,4)).concat(' ').concat(endTimes))
        )
        this.compatEvents.push(ev);
      } 
    });
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
