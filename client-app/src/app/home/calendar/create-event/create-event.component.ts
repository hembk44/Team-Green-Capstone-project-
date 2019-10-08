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
  primaryColor: string='';
  secondaryColor: string='';
  allDay=false;
  obj: Object;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataStorage: DataStorageService,
    private eventService: EventService,
  ) {}

  ngOnInit() {
    this.eventForm = new FormGroup({
      title: new FormControl(),
      description: new FormControl(),
      location: new FormControl(),
      email: this.email,
      startDate: new FormControl(),
      startTime: new FormControl(),
      endDate: new FormControl(),
      endTime: new FormControl(),
      primary: new FormControl(),
      secondary: new FormControl(),
      allDay: new FormControl()
    })
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

  allday(){
    this.allDay=!this.allDay;
    console.log(this.allDay);
  }

  onSubmit() {
    const eventFormValues = this.eventForm.value;
    console.log(eventFormValues.startDate.toLocaleDateString());
    console.log(this.primaryColor);
    console.log(this.secondaryColor);
    const startDate = eventFormValues.startDate.toDateString().concat(' ').concat(eventFormValues.startTime);
    const endDate = eventFormValues.endDate.toDateString().concat(' ').concat(eventFormValues.endTime);

    if(!this.allDay){
      this.obj = {
        name: eventFormValues.title,
        description: eventFormValues.description,
        start: startDate,
        end: endDate,
        email: [eventFormValues.email],
        location: eventFormValues.location,
        colors: {
          primary: this.primaryColor,
          secondary: this.secondaryColor
        },
        allDay: this.allDay
      };
    }else{
      this.obj = {
        name: eventFormValues.title,
        description: eventFormValues.description,
        start: eventFormValues.startDate.toString(),
        end: eventFormValues.endDate.toString(),
        email: [eventFormValues.email],
        location: eventFormValues.location,
        colors: {
          primary: this.primaryColor,
          secondary: this.secondaryColor
        },
        allDay: this.allDay
      };
    }

    console.log(this.obj);

    // this.dataStorage.storeEvent(obj).subscribe(result => {
    //   if (result) {
    //     this.dataStorage.fetchEvents();
    //   }
    // });

    this.router.navigate(["home/calendar"]);
  }
  setPrimary(color:string){
    this.primaryColor=color;
  }
  setSecondary(color:string){
    this.secondaryColor=color;
  }
  onNoClick(){
    this.router.navigate(["home/calendar"]);
  }
}

@Component({
  selector:"event-time-dialog",
  templateUrl: "event-timeInterval-dialog.html"
})
export class EventTimeDialog{
  startdate = new FormControl();
  enddate = new FormControl
  startDate = new Date().toLocaleDateString();
  endDate = new Date().toLocaleDateString();
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
      this.startdate.value,
      this.eventTimeArray
    )
    this.dateDataArray.push(this.dateData);
    this.startdate.setValue(this.startDate);
    this.enddate.setValue(this.enddate);
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
    this.timeIntervalFormData = new FormGroup({
      startTime: new FormControl(),
      endTime: new FormControl()
    })
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
