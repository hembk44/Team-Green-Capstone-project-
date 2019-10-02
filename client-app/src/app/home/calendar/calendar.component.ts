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
    this.dataStorage.fetchEvents();
    this.dataStorage.isLoading.subscribe(loading=>{
      if(!loading){
          this.calEvents = this.dataStorage.eventsList;
          console.log(this.dataStorage.eventsList);
          console.log(this.calEvents);
      }
      console.log('test');
      for(let event of this.calEvents){
        console.log(event);
        console.log(event.id);
        console.log(event.name);
        console.log(event.eventdates[0].eventtimes[0].endTime);
        console.log(event.eventdates[0].date.toString().substring(0,15).concat(' ').concat(event.eventdates[0].eventtimes[0].startTime));
        const ev = new CompatibleEvent(
          event.id,
          event.name,
          new Date(event.eventdates[0].date.toString().substring(0,15).concat(' ').concat(event.eventdates[0].eventtimes[0].startTime)),
          new Date(event.eventdates[event.eventdates.length - 1].date.toString().substring(0,15).concat(' ').concat(event.eventdates[event.eventdates.length - 1].eventtimes[event.eventdates[event.eventdates.length-1].eventtimes.length-1].endTime))
        )
        console.log(ev.start);
        console.log(ev.end);
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
