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

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;

  calEvents: CalEvent[];//list of events
  compatibleEvents: CompatibleEvent[] = [];

  ngOnInit() {
    //this.calEvents=this.eventService.getEvents();
    console.log(this.dataStorage.fetchEvents());
    this.dataStorage.isLoading.subscribe(loading=>{
      if(!loading){
        this.calEvents = this.dataStorage.eventsList;
      }
    })

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
