import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CalEvent } from '../../events.model';
import { CalendarService } from '../../calendar-list/calendar.service';
import { Calendar } from '../../calendar-list/calendar.model';
import { DataStorageService } from 'src/app/home/shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['../create-event.component.css']
})
export class EditEventComponent implements OnInit {
  id:number;
  event: CalEvent;
  eventForm: FormGroup;
  primaryColor: string='';
  allDay=false;
  calendars: Calendar[];
  obj: Object;
  username: string;
  selectedCal: number;
  defaultTime: Date = new Date();
  defaultTime2: Date = new Date();
  email = new FormControl("",[Validators.email]);
  newEnd: Date;
  emails: string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataStorage: DataStorageService,
    private calService: CalendarService
  ) { }

  ngOnInit() {
    this.emails=[];
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
    });
    this.event = this.calService.getEvent(this.id);
    this.newEnd = this.event.end;
    this.newEnd.setDate(this.newEnd.getDate()-1);
    this.primaryColor = this.event.backgroundColor;
    this.username = this.authService.name;
    this.calendars=this.calService.getCalendars().filter(cal => cal.createdBy === this.username);
    this.selectedCal = this.calService.getEventCal(this.event);
    console.log(this.selectedCal);
    this.allDay=(this.event.allDay);
    console.log(this.allDay);
    this.eventForm = new FormGroup({
      title: new FormControl(this.event.title,[Validators.required]),
      location: new FormControl(this.event.location),
      description: new FormControl(this.event.description),
      email: this.email,
      startDate: new FormControl(this.event.start,[Validators.required]),
      endDate: new FormControl(this.newEnd,[Validators.required]),
      startTime: new FormControl(this.event.start.toLocaleTimeString()),
      endTime: new FormControl(this.event.end.toLocaleTimeString()),
      primary: new FormControl(this.event.backgroundColor),
      allDay: new FormControl(this.event.allDay),
      calendar: new FormControl([Validators.required]),
    })
  }

  getErrorMessage(){
    return this.email.hasError("email")
    ? "Not a valid email"
    : "";
  }

  allday(){
    this.allDay = !this.allDay;
    console.log(this.allDay)
  }

  onSubmit(){
    const eventFormValues = this.eventForm.value;
    const startDate = eventFormValues.startDate.toDateString().concat(' ').concat(eventFormValues.startTime);
    const endDate = eventFormValues.endDate.toDateString().concat(' ').concat(eventFormValues.endTime);
    if(eventFormValues.email){
      this.emails=eventFormValues.email.split(',');
    }
    if(!this.allDay){
      this.obj = {
        calendarId: this.selectedCal,
        title: eventFormValues.title,
        description: eventFormValues.description,
        start: startDate,
        end: endDate,
        recipients: this.emails,
        location: eventFormValues.location,
        backgroundColor: this.primaryColor,
        borderColor: this.primaryColor,
        allDay: this.allDay
      }
    }else{
      this.newEnd = eventFormValues.endDate;
      this.newEnd.setDate(this.newEnd.getDate()+1);
      this.obj = {
        calendarId: this.selectedCal,
        title: eventFormValues.title,
        description: eventFormValues.description,
        start: eventFormValues.startDate,
        end: this.newEnd,
        recipients: [eventFormValues.email],
        location: eventFormValues.location,
        backgroundColor: this.primaryColor,
        borderColor: this.primaryColor,
        allDay: this.allDay
      };
    }

    // this.dataStorage.updateEvent(this.obj).subscribe(result => {
    //   if(result){
    //     this.dataStorage.fetchCalendars();
    //   }
    // });
    console.log(this.obj);
    this.router.navigate(["home/calendar"]);
  }

  setPrimary(color: string){
    this.primaryColor = color;
  }

  onNoClick(){
    this.router.navigate(["home/calendar"]);
  }

  selectCalendar(id: number){
    this.selectedCal = id;
  }

}
