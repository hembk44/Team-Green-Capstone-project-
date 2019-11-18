import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { CalEvent } from "../events.model";
import { Router } from "@angular/router";
import { CalendarService } from "../calendar-list/calendar.service";
import { Calendar } from "../calendar-list/calendar.model";
import { MatDialog, MatSnackBar, MatChipInputEvent } from "@angular/material";
import { DataStorageService } from "../../shared/data-storage.service";
import { EventDate } from "../event-date.model";
import { AuthService } from "src/app/auth/auth.service";
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { GroupSelection } from '../../shared/group-selection';

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  eventData: CalEvent;
  email = new FormControl();
  dateRangeArray: EventDate[] = [];
  primaryColor: string = "#5484ed";
  secondaryColor: string = "";
  allDay = false;
  calendars: Calendar[];
  obj: Object;
  username: string;
  selectedCal: number;
  defaultTime: Date = new Date();
  defaultTime2: Date = new Date();
  emails: string[] =[];
  startDate;
  endDate;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private dataStorage: DataStorageService,
    private calService: CalendarService,
    private snackbar: MatSnackBar
  ) {}
  
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

  ngOnInit() {
    this.emails = [];
    this.username = this.authService.name;
    console.log(this.username);
    this.calendars = this.calService
      .getCalendars()
      .filter(cal => cal.createdBy.email === this.username);
    console.log(this.calendars);
    this.eventForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl(""),
      location: new FormControl(""),
      email: this.email,
      startDate: new FormControl(new Date()),
      startTime: new FormControl(),
      endDate: new FormControl(new Date()),
      endTime: new FormControl(),
      primary: new FormControl([Validators.required]),
      allDay: new FormControl(),
      calendar: new FormControl([Validators.required])
    });
  }

  getErrorMessage() {
    return this.email.hasError("email") ? "Not a valid email" : "";
  }

  allday() {
    this.allDay = !this.allDay;
    console.log(this.allDay);
  }

  onSubmit() {
    const eventFormValues = this.eventForm.value;
    if (eventFormValues.email) {
      this.emails = eventFormValues.email.split(",");
    }
    console.log(eventFormValues.startDate.toLocaleDateString());
    console.log(this.primaryColor);
    console.log(this.secondaryColor);
    if(!this.allDay){
      this.startDate = new Date(eventFormValues.startDate
        .toDateString()
        .concat(" ")
        .concat(eventFormValues.startTime));
        console.log(this.startDate);
      this.endDate = new Date(eventFormValues.endDate
        .toDateString()
        .concat(" ")
        .concat(eventFormValues.endTime));
    } else{
      this.startDate = new Date(eventFormValues.startDate);
      this.endDate = new Date(eventFormValues.endDate);
    }
    
    //checking if start comes before end
    if (this.startDate <= this.endDate) {
      //creating event object based on allDay
      if (!this.allDay) {
        this.obj = {
          calendarId: this.selectedCal,
          title: eventFormValues.title,
          description: eventFormValues.description,
          start: this.startDate,
          end: this.endDate,
          recipients: this.emails,
          location: eventFormValues.location,
          backgroundColor: this.primaryColor,
          borderColor: this.primaryColor,
          allDay: this.allDay
        };
      } else {
        eventFormValues.endDate.setDate(eventFormValues.endDate.getDate() + 1);
        this.obj = {
          calendarId: this.selectedCal,
          title: eventFormValues.title,
          description: eventFormValues.description,
          start: eventFormValues.startDate,
          end: eventFormValues.endDate.toISOString(),
          recipients: this.emails,
          location: eventFormValues.location,
          backgroundColor: this.primaryColor,
          borderColor: this.primaryColor,
          allDay: this.allDay
        };
      }

      console.log(this.obj);
      //sending to database
      this.dataStorage.storeEvent(this.obj).subscribe(result => {
        if (result) {
          this.dataStorage.fetchCalendars();
        }
      });

      //confirmation snackbar
      this.snackbar.open("Event created successfully", "OK", {
        duration: 3000
      });
      this.router.navigate(["home/calendar"]);
    } else {
      //warning for start not being before end
      this.snackbar.open("Start must come before end.", "OK", {
        duration: 5000
      });
    }
  }

  //set event color
  setPrimary(color: string) {
    this.primaryColor = color;
  }

  //cancel event creation
  onNoClick() {
    this.router.navigate(["home/calendar"]);
  }

  //setting calendar for event
  selectCalendar(id: number) {
    this.selectedCal = id;
    console.log(this.selectedCal);
  }
  
  //adding email to list
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

  //removing email from list
  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
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

