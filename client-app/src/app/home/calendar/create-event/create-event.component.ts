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

@Component({
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"]
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  //calendars: Calendar[];
  email = new FormControl("",[Validators.required, Validators.email]);
  dateRangeArray: DateRange[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private dataStorage: DataStorageService
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
    return this.email.hasError("email")
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
    // const obj = {
    //   name: eventFormValues.title,
    //   description: eventFormValues.description,
    //   dates: this.dateRangeArray,
    //   location: eventFormValues.location
    // };
    const obj = JSON.stringify({
      name: eventFormValues.title,
      description: eventFormValues.description,
      eventdates: [
          {
              date: this.dateRangeArray[0].date,
              eventtimes: [
                  {
                      startTime: this.dateRangeArray[0].times[0].startTime,
                      endTime: this.dateRangeArray[0].times[0].endTime
                  }
              ]
          }
      ],
      location: eventFormValues.location
    })
    
    this.dataStorage.storeEvent(obj).subscribe(result => {
      // if(result) {
      //   this.dataStorage.fetchEvents();
      // }
      console.log(result);
    });

    this.router.navigate(["home"]);
  }
}
