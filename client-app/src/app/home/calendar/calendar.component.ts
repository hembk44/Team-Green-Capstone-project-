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

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {
  subscription: Subscription;

  constructor(private eventService: EventService, private router: Router) {}

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = false;

  events: CalEvent[];

  ngOnInit() {
    this.setView(CalendarView.Month);
    this.events = this.eventService.getEvents();
    this.subscription = this.eventService.eventsChanged.subscribe(
      (events: CalEvent[]) => {
        this.events = events;
      }
    );
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
    }
  }

  eventClicked(event: CalEvent) {
    console.log(event);
  }

  createEvent() {
    this.router.navigate(["home/create-event"]);
  }
}
