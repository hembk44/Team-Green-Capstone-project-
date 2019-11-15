import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CalendarService } from '../calendar/calendar-list/calendar.service';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

  userRole: string;
  events: any[];
  calendarPlugins=[listPlugin];

  constructor(private http: HttpClient,
    private dataStorage: DataStorageService,
    private authService: AuthService,
    private calService: CalendarService) {}

  ngOnInit() {
    this.dataStorage.fetchCalendars();
    this.dataStorage.isLoading.subscribe(loading =>{
      if(!loading){
        this.events = this.calService.getEvents();
      }
    });
    console.log(this.events);
    this.userRole = this.authService.user;
  }

}
