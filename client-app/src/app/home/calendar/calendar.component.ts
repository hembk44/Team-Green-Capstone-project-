import {
  Component,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataStorageService } from '../shared/data-storage.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from './calendar-list/calendar.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { CalendarCreateComponent } from './calendar-create/calendar-create.component';
import { CalEvent } from './events.model';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"]
})
export class CalendarComponent implements OnInit {

  constructor(private router: Router, 
    private dataStorage: DataStorageService, 
    private authService: AuthService,
    private dialog: MatDialog,
    private calService: CalendarService) {}

  viewDate: Date;
  activeDayIsOpen: boolean = false;
  role = this.authService.user;
  panelOpen=false;
  subscription: Subscription;
  calendarPlugins = [dayGridPlugin,timeGridPlugin,listPlugin];
  weekends: boolean;
  compatEvents=[];
  //apptEvents: any[] = [];

  ngOnInit() {
    //get calendars from database
    this.dataStorage.fetchCalendars();
    this.dataStorage.isLoading.subscribe(loading => {
      if(!loading){
        this.compatEvents=this.calService.getEvents();
        for(let event of this.compatEvents){
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        }
      }
    })
    this.viewDate = new Date();
    this.subscription = this.calService.eventsChanged.subscribe(
      (events: CalEvent[]) => {
        this.compatEvents = events;
      }
    );
  }

  //opens event detail dialog
  eventClicked(event: CalEvent) {
    this.dialog.open(EventDetailComponent, {
      width: "600px",
      data: event
    })
  }

  // navigates to event creation form
  createEvent() {
    this.router.navigate(["home/create-event"]);
  }

  //opens calendar creation dialog
  newCal(){
    this.dialog.open(CalendarCreateComponent, {
      width:"400px"
    });
  }
}
