import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { CalEvent } from "../events.model";
import { Router } from "@angular/router";
import { CalendarService } from "../calendar-list/calendar.service";
import { Calendar } from "../calendar-list/calendar.model";
import { MatDialog, MatSnackBar, MatChipInputEvent, MatAutocompleteSelectedEvent } from "@angular/material";
import { DataStorageService, Emails } from "../../shared/data-storage.service";
import { EventDate } from "../event-date.model";
import { AuthService } from "src/app/auth/auth.service";
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { GroupSelection } from '../../shared/group-selection';
import { startWith, map } from 'rxjs/operators';
import { AppointmentSnackbarComponent } from '../../appointment/shared-appointment/appointment-snackbar/appointment-snackbar.component';

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  eventData: CalEvent;
  email = new FormControl("",[Validators.email]);
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
  isEmailValid = true;
  errorMessage: string;
  @ViewChild("chipList", { static: false }) chipList;
  role: string;
  userList: any = [];
  filteredUserList: any;
  userInput: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private dataStorage: DataStorageService,
    private calService: CalendarService,
    private snackbar: MatSnackBar
  ) {
    this.dataStorage.getEmails();
    this.dataStorage.emails.subscribe((result: Emails[]) => {
      if (result.length > 0) {
        result.forEach(o => this.userList.push(o.email));
      }
    });

    this.filteredUserList = this.email.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.userList.slice()
      )
    );
  }
  
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
    this.role = this.authService.user;
    console.log(this.username);
    this.calendars = this.calService
      .getCalendars()
      .filter(cal => cal.createdBy.email === this.username);
    console.log(this.calendars);
    this.eventForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("",[Validators.required]),
      location: new FormControl("",[Validators.required]),
      email: this.email,
      startDate: new FormControl(new Date(),[Validators.required]),
      startTime: new FormControl(),
      endDate: new FormControl(new Date(),[Validators.required]),
      endTime: new FormControl(),
      primary: new FormControl([Validators.required]),
      allDay: new FormControl(),
      calendar: new FormControl([Validators.required])
    });
  }

  filter(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();
    return this.userList.filter(user =>
      user.toLocaleLowerCase().includes(filterValue)
    );
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.emails.includes(event.option.value)) {
      this.emails.push(event.option.value);
      this.userInput.nativeElement.value = "";
      this.email.setValue(null);
    }
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
    if(!this.allDay){
      this.startDate = new Date(eventFormValues.startDate
        .toDateString()
        .concat(" ")
        .concat(eventFormValues.startTime));
      this.endDate = new Date(eventFormValues.endDate
        .toDateString()
        .concat(" ")
        .concat(eventFormValues.endTime));
    } else{
      this.startDate = new Date(eventFormValues.startDate.toLocaleDateString());
      this.endDate = new Date(eventFormValues.endDate.toLocaleDateString());
    }
    console.log(this.startDate,this.endDate);
    //checking if start comes before end
    if ((this.startDate <= this.endDate && this.allDay) || (this.startDate<this.endDate && !this.allDay)) {
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
          this.snackbar.open(result.message, 'close', {duration:4000, panelClass: ["standard"]})
        } else {
          this.snackbar.open('Something went wrong.', 'close', {duration:4000, panelClass: ["standard"]})
        }
      });
      this.router.navigate(["home/calendar"]);
    } else {
      //warning for start not being before end
      this.snackbar.open('Start must come before end.', 'close', {duration:4000, panelClass: ["standard"]})
      
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
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    // const value = event.value;
    this.email.setValue(event.value);
    console.log(this.email.hasError("email"));
    if (!this.email.hasError("email")) {
      // if (!this.email.hasError("email")) {
      if (this.email.value.trim()) {
        this.isEmailValid = true;
        this.emails.push(this.email.value.trim());
        console.log(this.emails);
      } else if (this.email.value === "" && this.emails.length < 0) {
        this.chipList.errorState = true;
        this.isEmailValid = false;
        this.errorMessage = "please enter a valid email address";
      } else {
        this.chipList.errorState = false;
      }
    } else {
      this.chipList.errorState = true;
      this.isEmailValid = false;
      this.errorMessage = "please enter a valid email address";
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
      width: "500px"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      for(let group of result){
        console.log(group);
        for(let email of group.emails){
          console.log(email);
          if(!this.emails.includes(email.email)){
            this.emails.push(email.email);
          }
        }
      }
    });
}
}

