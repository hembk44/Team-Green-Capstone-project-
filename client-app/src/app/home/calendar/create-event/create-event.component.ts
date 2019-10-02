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
import { EventDate } from '../event-date.model';
import { TimeInterval } from '../../appointment/appointment-model/time-interval.model';
import { EventTime } from '../event-times.model';

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  //calendars: Calendar[];
  eventData: CalEvent;
  email = new FormControl("",[Validators.required, Validators.email]);
  dateRangeArray: DateRange[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataStorage: DataStorageService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      location: [""],
      email:this.email
    });
    //this.calendars = this.calendarService.getCalendars();
  }

  getErrorMessage(){
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }

  openDateRangeDialog(): void {
    const dialogRef = this.dialog.open(DialogDateTimeIntervalDialog, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.dateRangeArray = result;
    });
  }

  onSubmit() {
    const eventFormValues = this.eventForm.value;
    console.log(this.dateRangeArray[0]);
    const eventDate = this.dateRangeArray[0].date;
    const eventstart = this.dateRangeArray[0].times[0].startTime;
    const eventEnd = this.dateRangeArray[0].times[0].endTime;
    const eventtimes = new EventTime(eventstart,eventEnd);
    const eventdaterange = new EventDate(eventDate,[eventtimes]);
    const tempid = 8;

    console.log(eventdaterange);

    // const newEvent: CalEvent = new CalEvent(
    //   11,
    //   eventFormValues.title,
    //   eventFormValues.description,
    //   eventFormValues.location,
    //   [eventFormValues.email],
    //   [eventdaterange]
    // );
    // this.eventService.addEvent(newEvent);

    const obj: Object = {
      name: eventFormValues.title,
      description: eventFormValues.description,
      eventdates: [eventdaterange],
      recepients: [this.email],
      location: eventFormValues.location
    }
     
    console.log(obj);
    
    this.dataStorage.storeEvent(obj).subscribe(result => {
      console.log('event sent to backend');
      if(result) {
        this.dataStorage.fetchEvents();
      }
      console.log(result);
    });

    this.router.navigate(["home/calendar"]);
  }
}
