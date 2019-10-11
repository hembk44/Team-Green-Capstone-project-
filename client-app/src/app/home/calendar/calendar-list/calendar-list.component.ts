import { Component, OnInit } from "@angular/core";
import { CalendarService } from "./calendar.service";
import { Calendar } from "./calendar.model";
import { EventService } from "../events.service";

@Component({
  selector: "app-calendar-list",
  templateUrl: "./calendar-list.component.html",
  styleUrls: ["./calendar-list.component.css"]
})
export class CalendarListComponent implements OnInit {
  private calendars: Calendar[]; //list of calendars

  constructor(
    private calendarService: CalendarService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.calendars = this.calendarService.getCalendars(); //gets calendars from service
  }

  //toggle view of calendars
  toggleCalendar(cal: Calendar) {
    this.calendarService.toggleCalendar(cal);
  }
}
