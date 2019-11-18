import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { Router } from "@angular/router";
import { Appointment } from "../models-appointments/appointment.model";
import { DateRange } from "../models-appointments/date-range.model";
import { TimeInterval } from "../models-appointments/time-interval.model";
import { DataStorageService } from "../../shared/data-storage.service";
import { ApiResponse } from "src/app/auth/api.response";
import { EventTime } from "../../calendar/event-times.model";
import { EventDate } from "../../calendar/event-date.model";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { GroupSelection } from '../../shared/group-selection';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

@Component({
  selector: "app-appointment-create",
  templateUrl: "./appointment-create.component.html",
  styleUrls: ["./appointment-create.component.css"]
})
export class AppointmentCreateComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  appointmentForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  appointmentData: Appointment;
  dateRangeArray: DateRange[] = [];
  emails: string[] = [];

  //theme for time picker
  timeTheme: NgxMaterialTimepickerTheme={
    container: {
      bodyBackgroundColor: 'darkgrey',
      buttonColor: 'white'
    },
    dial: {
      dialBackgroundColor: 'rgb(185, 163, 90)'
    },
    clockFace: {
      clockHandColor: '#800029',

    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    // this.appointmentForm = this.formBuilder.group({
    //   title: ["", Validators.required],
    //   description: ["", Validators.required],
    //   location: [""],
    //   email: this.email
    // });
    this.initForm();
  }

  private initForm(){
    let title = '';
    let description = '';
    let location = '';
    let email = this.email;
    let dateRange = new FormArray([]);

    this.appointmentForm = new FormGroup({
      'title': new FormControl(title,[Validators.required]),
      'description': new FormControl(description),
      'location': new FormControl(location),
      'email': email,
      'dateRange': dateRange
    })    
  }

  cancel() {
    this.router.navigate(["/home/appointment/sent"]);
  }

  addDate(){
    (<FormArray>this.appointmentForm.get('dateRange')).push(
      this.formBuilder.group({
        date:[''],
        start:[''],
        end: [''],
        interval:['']
      })
    );
  }

  deleteDate(index:number){
    (<FormArray>this.appointmentForm.get('dateRange')).removeAt(index);
  }

  // addEmails() {
  //   this.emails.push(this.appointmentForm.value.email);
  //   console.log(this.emails);
  //   this.email.reset();
  // }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add emails
    if (value.trim()) {
      this.emails.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a valid email address"
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
  y;

  onSubmit() {
    const appointmentFormValues = this.appointmentForm.value;
    // this.emails.push(this.appointmentForm.value.email);
    console.log(appointmentFormValues.dateRange);
    for(let date of appointmentFormValues.dateRange){
      this.dateRangeArray.push({
        date: date.date.toLocaleDateString(),
        apptimes: [{
          startTime: '0'.concat(date.start),
          endTime: '0'.concat(date.end),
          interv: date.interval
        }]
      })
    }
    const obj = {
      name: appointmentFormValues.title,
      description: appointmentFormValues.description,
      recepients: this.emails,
      location: appointmentFormValues.location,
      appdates: this.dateRangeArray
    };
    console.log(obj);
    this.dataStorage.storeAppointment(obj).subscribe(result => {
      if (result) {
        console.log(result);
        this.dataStorage.fetchAppointment();
        console.log(result.result.id);
        this.dataStorage.sendApptToCal(result.result.id).subscribe(result => {
          console.log(result);
        });
      }
    });

    // console.log('sending to calendar')
    // console.log(this.dateRangeArray);
    // for(let date of this.dateRangeArray){
    //   console.log(date);
    //   const eventDate = date.date;
    //   console.log(eventDate);
    //   const eventstart = date.apptimes[0].startTime.substring(0,5).concat(' ').concat(date.apptimes[0].startTime.substring(5,7));
    //   console.log(eventstart);
    //   const eventEnd = date.apptimes[date.apptimes.length-1].endTime.substring(0,5).concat(' ').concat(date.apptimes[date.apptimes.length-1].endTime.substring(5,7));
    //   console.log(eventEnd)
    //   const eventtimes = new EventTime(eventstart,eventEnd);
    //   console.log(eventtimes);
    //   const eventdaterate = new EventDate(eventDate, [eventtimes]);
    //   console.log(eventdaterate);
    //   const obj2 = {
    //     name: appointmentFormValues.title,
    //     description: appointmentFormValues.description,
    //     eventdates: [eventdaterate],
    //     receipients: [this.email],
    //     location: 'unspecified location'
    //   }
    //   console.log(obj2);
    //   this.dataStorage.storeEvent(obj2).subscribe(result =>{
    //     if(result){
    //       this.dataStorage.fetchEvents();
    //     }
    //   })
    // }
  }

  groupSelect(){
    const dialogRef = this.dialog.open(GroupSelection, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      for(let email of result){
        if(!this.emails.includes(email)){
          this.emails.push(email);
        }
      }
    })
  }
}

@Component({
  selector: "dialog-date-timeInterval-dialog",
  templateUrl: "date-timeInterval-dialog.html",
  styleUrls: ["./appointment-create.component.css"]
})
export class DialogDateTimeIntervalDialog implements OnInit {
  date = new FormControl("");
  dateRangeData: DateRange;
  dateRangeDataArray: DateRange[] = [];
  timeIntervalDataArray: TimeInterval[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogDateTimeIntervalDialog>,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  openTimeIntervalDialog(): void {
    const dialogRef = this.dialog.open(DialogTimeIntervalDialog, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.timeIntervalDataArray = result;
    });
  }
  addDate() {
    this.dateRangeData = new DateRange(
      this.date.value,
      this.timeIntervalDataArray
    );
    this.dateRangeDataArray.push(this.dateRangeData);
    this.date.setValue("");
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialogData() {
    this.addDate();
    console.log("Date Array: " + this.dateRangeDataArray);
    this.dialogRef.close(this.dateRangeDataArray);
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

}

@Component({
  selector: "dialog-time-interval-dialog",
  templateUrl: "time-interval-dialog.html",

  styleUrls: ["./appointment-create.component.css"]
})
export class DialogTimeIntervalDialog implements OnInit {
  TimeIntervalFormData: FormGroup;
  timeIntervalData: TimeInterval;
  timeIntervalDataArray: TimeInterval[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogTimeIntervalDialog>
  ) {}

  ngOnInit() {
    this.TimeIntervalFormData = this.formBuilder.group({
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      timeInterval: ["", Validators.required]
    });
  }
  addTimeInterval() {
    const timeIntervalDataValues = this.TimeIntervalFormData.value;
    this.timeIntervalData = new TimeInterval(
      timeIntervalDataValues.startTime,
      timeIntervalDataValues.endTime,
      timeIntervalDataValues.timeInterval
    );
    this.timeIntervalDataArray.push(this.timeIntervalData);
    this.TimeIntervalFormData.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialogData() {
    this.addTimeInterval();
    console.log("Time Interval Array: " + this.timeIntervalDataArray);
    this.dialogRef.close(this.timeIntervalDataArray);
    this.timeIntervalDataArray = [];
  }
}
