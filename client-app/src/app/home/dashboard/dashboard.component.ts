import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CalendarService } from '../calendar/calendar-list/calendar.service';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Subscription } from 'rxjs';
import { EventDetailComponent } from '../calendar/event-detail/event-detail.component';
import { CalEvent } from '../calendar/events.model';
import { MatDialog } from '@angular/material';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

  userRole: string;
  events: any[];
  calendarPlugins=[timeGridPlugin];
  name: string;
  subscription: Subscription;

  constructor(private http: HttpClient,
    private dataStorage: DataStorageService,
    private authService: AuthService,
    private calService: CalendarService,
    private dialog: MatDialog) {}

  ngOnInit() {
    this.dataStorage.fetchCalendars();
    this.name = this.authService.username;
    this.dataStorage.isLoading.subscribe(loading =>{
      if(!loading){
        this.events = this.calService.getEvents();
        console.log(this.events);
      }
    });
    this.subscription = this.calService.eventsChanged.subscribe(
      (events: any[]) => {
        this.events = events;
      }
    );
    this.userRole = this.authService.user;
  }

  eventClicked(event: CalEvent) {
    this.dialog.open(EventDetailComponent, {
      width: "600px",
      height: "450px",
      data: event
    });
  }

}
