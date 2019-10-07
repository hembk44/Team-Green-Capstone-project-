import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CalEvent } from "../events.model";
import { EventService } from "../events.service";
import { Router } from "@angular/router";
import { CalendarService } from "../calendar-list/calendar.service";
import { Calendar } from "../calendar-list/calendar.model";
import { DateRange } from "../../appointment/appointment-model/date-range.model";
import { MatDialog, MatDialogRef } from "@angular/material";
import { DataStorageService } from "../../shared/data-storage.service";
import { DialogDateTimeIntervalDialog } from "../../appointment/appointment-create/appointment-create.component";
import { EventDate } from "../event-date.model";
import { TimeInterval } from "../../appointment/appointment-model/time-interval.model";
import { EventTime } from "../event-times.model";

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  //calendars: Calendar[];
  eventData: CalEvent;
  email = new FormControl("", [Validators.email]);
  dateRangeArray: EventDate[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataStorage: DataStorageService,
    private eventService: EventService,
    private ref: MatDialogRef<CreateEventComponent>
  ) {}

  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      location: [""],
      email: this.email
    });
    //this.calendars = this.calendarService.getCalendars();
  }

  getErrorMessage() {
    return this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }

  openDateRangeDialog(): void {
    const dialogRef = this.dialog.open(EventTimeDialog, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.dateRangeArray = result;
    });
  }

  onSubmit() {
    const eventFormValues = this.eventForm.value;
    const eventDate = this.dateRangeArray[0].date;
    const eventstart = this.dateRangeArray[0].eventtimes[0].startTime;
    const eventEnd = this.dateRangeArray[0].eventtimes[0].endTime;
    const eventtimes = new EventTime(eventstart, eventEnd);
    const eventdaterange = new EventDate(eventDate, [eventtimes]);
    const tempid = 8;

    console.log(eventdaterange);

    const obj = {
      name: eventFormValues.title,
      description: eventFormValues.description,
      eventdates: [eventdaterange],
      recepients: [eventFormValues.email],
      location: eventFormValues.location
    };

    this.dataStorage.storeEvent(obj).subscribe(result => {
      if (result) {
        this.dataStorage.fetchEvents();
      }
    });

    this.router.navigate(["home/calendar"]);
  }
  onNoClick(){
    this.ref.close();
  }
}

@Component({
  selector:"event-time-dialog",
  templateUrl: "event-timeInterval-dialog.html"
})
export class EventTimeDialog{
  date = new FormControl("");
  dateData: EventDate;
  dateDataArray: EventDate[]=[];
  eventTimeArray: EventTime[]=[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EventTimeDialog>,
    public dialog: MatDialog
  ){}

  openTimeDialog():void{
    const dialogRef = this.dialog.open(EventTimeIntervalDialog, {
      width:"300px"
    })
    dialogRef.afterClosed().subscribe(result => {
      this.eventTimeArray = result;
    })
  }

  addDate(){
    this.dateData = new EventDate(
      this.date.value,
      this.eventTimeArray
    )
    this.dateDataArray.push(this.dateData);
    this.date.setValue("");
  }

  onNoClick():void{
    this.dialogRef.close();
  }

  saveDialogData(){
    this.addDate();
    this.dialogRef.close(this.dateDataArray);
  }

}

@Component({
  selector:"event-time-dialog",
  templateUrl: "event-time-dialog.html"
})
export class EventTimeIntervalDialog implements OnInit{

  timeIntervalFormData: FormGroup;
  timeIntervalData: EventTime;
  timeDataArray: EventTime[]=[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EventTimeIntervalDialog>
  ){}

  ngOnInit(){
    this.timeIntervalFormData = this.formBuilder.group({
      startTime: ["", Validators.required],
      endTime: ["", Validators.required]
    });
  }
  addTimeInterval(){
    const timeIntervalDataValues = this.timeIntervalFormData.value;
    this.timeIntervalData = new EventTime(
      timeIntervalDataValues.startTime,
      timeIntervalDataValues.endTime
    );
    this.timeDataArray.push(this.timeIntervalData);
    this.timeIntervalFormData.reset();
  }
  onNoClick():void{
    this.dialogRef.close();
  }

  saveDialogData(){
    this.addTimeInterval();
    this.dialogRef.close(this.timeDataArray);
    this.timeDataArray =[];
  }

}
