import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { CalEvent } from "../events.model";
import { EventService } from "../events.service";
import { Router } from "@angular/router";
import { CalendarService } from "../calendar-list/calendar.service";
import { Calendar } from "../calendar-list/calendar.model";
import { DateRange } from '../../appointment/appointment-model/date-range.model';
import { MatDialog } from '@angular/material';
import { DataStorageService } from '../../shared/data-storage.service';
import { DialogDateTimeIntervalDialog } from '../../appointment/appointment-create/appointment-create.component';
import { ICalEvent } from '../event-interface/event';

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  calendars: Calendar[];
  dateRangeArray: DateRange[] = [];
  eventData: CalEvent;

  constructor(
    private eventService: EventService,
    private router: Router,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      location: [""]
    });
    this.calendars = this.calendarService.getCalendars();
  }

  // initForm() {
  //   let eventName = "";
  //   let startDate = "";
  //   let startTime = "";
  //   let endDate = "";
  //   let endTime = "";
  //   let description = "";
  //   let location = "";

  //   this.eventForm = new FormGroup({
  //     name: new FormControl(eventName),
  //     "start-date": new FormControl(startDate),
  //     "start-time": new FormControl(startTime),
  //     "end-date": new FormControl(endDate),
  //     "end-time": new FormControl(endTime),
  //     description: new FormControl(description),
  //     location: new FormControl(location)
  //   });
  // }

  openDateRangeDialog(): void {
    const dialogRef = this.dialog.open(DialogDateTimeIntervalDialog, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.dateRangeArray = result;
      // this.appointmentDate = result.date;
      // console.log(this.appointmentDate);
      // this.startTime = result.startTime;
      // this.endTime = result.endTime;
      // this.timeInterval = result.timeInterval;
    });
  }

  onSubmit() {
    const eventFormValues = this.eventForm.value;

    this.eventData = new CalEvent(
      eventFormValues.title,
      eventFormValues.description,
      eventFormValues.location,
      ['andrew.moore9497@gmail.com'],
      this.dateRangeArray
    );
    this.dataStorage.storeEvent(this.eventData);
    this.dataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.dataStorage.fetchEvents();
      }
    });

    //this.eventService.addEvent(this.eventData);
    this.dataStorage.storeEvent(this.eventData);

    this.router.navigate(["home/calendar"]);
  }
}
