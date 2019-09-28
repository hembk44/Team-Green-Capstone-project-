import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { CalEvent } from "../events.model";
import { EventService } from "../events.service";
import { Router } from "@angular/router";
import { CalendarService } from "../calendar-list/calendar.service";
import { Calendar } from "../calendar-list/calendar.model";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  calendars: Calendar[];

  constructor(
    private eventService: EventService,
    private router: Router,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.initForm();
    this.calendars = this.calendarService.getCalendars();
  }

  initForm() {
    let eventName = "";
    let startDate = "";
    let startTime = "";
    let endDate = "";
    let endTime = "";
    let description = "";
    let location = "";

    this.eventForm = new FormGroup({
      name: new FormControl(eventName),
      "start-date": new FormControl(startDate),
      "start-time": new FormControl(startTime),
      "end-date": new FormControl(endDate),
      "end-time": new FormControl(endTime),
      description: new FormControl(description),
      location: new FormControl(location)
    });
  }

  onSubmit() {
    // for appt, only have one option for date
    const start = new Date(
      this.eventForm.value["start-date"]
        .toLocaleString()
        .concat(" ", this.eventForm.value["start-time"])
        .toLocaleString()
    );
    const end = new Date(
      this.eventForm.value["end-date"]
        .toLocaleString()
        .concat(" ", this.eventForm.value["end-time"])
        .toLocaleString()
    );

    const newEvent: CalEvent = new CalEvent(
      this.eventForm.value["name"],
      start,
      end,
      ["andrew"],
      this.eventForm.value["description"],
      this.eventForm.value["location"],
      "event",
      this.calendars[1]
    );

    this.eventService.addEvent(newEvent);
    this.router.navigate(["home/calendar"]);
  }
}
