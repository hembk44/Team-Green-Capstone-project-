import { Component, OnInit } from "@angular/core";
import { isSameMonth } from "date-fns";
import { CalendarEvent, CalendarView } from "angular-calendar";
import { CalEvent } from "./events.model";
import { EventService } from "./events.service";
import { Router } from "@angular/router";
import { CompatibleEvent } from "./compatible-events.model";
import { DataStorageService } from "../shared/data-storage.service";
import { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { AuthService } from "src/app/auth/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { CreateEventComponent } from "./create-event/create-event.component";
import { CalendarService } from "./calendar-list/calendar.service";
import { Subscription } from "rxjs/internal/Subscription";
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { CalendarCreateComponent } from "./calendar-create/calendar-create.component";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {
  constructor(
    private router: Router,
    private dataStorage: DataStorageService,
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog,
    private calService: CalendarService
  ) {}

  viewDate: Date;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;
  role = this.authService.user;
  panelOpen = false;
  subscription: Subscription;
  calendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin];
  weekends: boolean;
  compatEvents = [];
  //apptEvents: any[] = [];

  ngOnInit() {
    this.dataStorage.fetchCalendars();
    this.dataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.compatEvents = this.calService.getEvents();
        console.log(this.compatEvents);
        for (let event of this.compatEvents) {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        }
      }
    });
    this.viewDate = new Date();
    this.subscription = this.calService.eventsChanged.subscribe(
      (events: CalEvent[]) => {
        this.compatEvents = events;
        console.log(this.compatEvents);
      }
    );
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

  eventClicked(event: CalEvent) {
    this.dialog.open(EventDetailComponent, {
      width: "400px",
      data: event
    });
    console.log(event);
    // this.router.navigate(["home/event", event.id]);
  }

  // navigates to event creation form
  createEvent() {
    // const dialogRef = this.dialog.open(CreateEventComponent, {
    //   width:"600px"
    // })
    this.router.navigate(["home/create-event"]);
  }

  toggleWeekends() {
    this.weekends = !this.weekends;
  }

  newCal() {
    this.dialog.open(CalendarCreateComponent, {
      width: "400px"
    });
  }
}
