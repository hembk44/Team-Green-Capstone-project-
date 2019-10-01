import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import { CalendarEvent, CalendarView } from "angular-calendar";
import { Subject, Subscription } from "rxjs";
import { CalEvent } from "./events.model";
import { EventService } from "./events.service";
import { Router } from "@angular/router";
import { CompatibleEvent } from './compatible-events.model';
import { Time } from '@angular/common';
import { ICalEvent } from './event-interface/event';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {
  subscription: Subscription;

  constructor(private eventService: EventService, private router: Router, private dataStorage: DataStorageService) {}

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;

  calEvents: ICalEvent[] = [];//list of events
  compatibleEvents: CompatibleEvent[] = [];

  ngOnInit() {
    this.setView(CalendarView.Month);
    this.dataStorage.isLoading.subscribe(loading => {
      if(!loading){
        this.dataStorage.fetchEvents();
        this.calEvents = this.dataStorage.eventList;
      }
    })

    //converting events for compatibility with calendar
    for(let event of this.calEvents){
      const tempStartDate = new Date(event.dates[0].date.toString().substring(0,15).concat(' ').concat(event.dates[0].times[0].startTime));
      const tempEndDate = new Date(event.dates[event.dates.length - 1].date.toString().substring(0,14).concat(' ').concat(event.dates[event.dates.length - 1].times[event.dates[event.dates.length-1].times.length-1].endTime));
      const tempEvent: CompatibleEvent = new CompatibleEvent(
        event.name,
        tempStartDate,
        tempEndDate
      );
      
      this.compatibleEvents.push(tempEvent);
    }

  }

  //changes view of calendar to day, week, month
  setView(view: CalendarView) {
    this.view = view;
  }

  // changes view date for list of events
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
