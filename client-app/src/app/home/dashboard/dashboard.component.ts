import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { CalendarService } from "../calendar/calendar-list/calendar.service";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Subscription } from "rxjs";
import { EventDetailComponent } from "../calendar/event-detail/event-detail.component";
import { CalEvent } from "../calendar/events.model";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupDataStorageService } from "../group/group-data-storage.service";
import { DataStorageAppointmentService } from "../appointment/shared-appointment/data-storage-appointment.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  userRole: string;
  events: CalEvent[];
  calendarPlugins = [timeGridPlugin];
  name: string;
  group: any;
  isGroupEmpty: boolean = false;
  currentRole: string = "";
  appointments: any;
  appointmentDate: string = "";
  datesArr: any;
  // subscription: Subscription;

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService,
    private calService: CalendarService,
    private dialog: MatDialog,
    private router: Router,
    private groupDataStorage: GroupDataStorageService,
    private role: AuthService,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar,
    private dataStorageAppointment: DataStorageAppointmentService
  ) {
    this.currentRole = this.role.user;
    this.groupDataStorage.fetchGroup();
    console.log(this.groupDataStorage.groupLists);
    this.groupDataStorage.isLoading.subscribe(loading => {
      console.log(loading);
      if (!loading) {
        if (this.groupDataStorage.groupLists.length > 0) {
          this.group = this.groupDataStorage.groupLists;
          this.isGroupEmpty = false;
          console.log(this.group);
        } else {
          this.isGroupEmpty = true;
        }
      }
    });
  }

  ngOnInit() {
    // if (
    //   this.currentRole === "ROLE_USER" ||
    //   this.currentRole === "ROLE_MODERATOR"
    // ) {
    //   this.dataStorageAppointment.fetchUserAppointment();
    //   this.dataStorageAppointment.isLoading.subscribe(loading => {
    //     console.log(loading);

    //     if (!loading) {
    //       console.log(this.dataStorageAppointment.appointmentLists);
    //       this.appointments = this.dataStorageAppointment.appointmentLists;
    //       for (let d of this.appointments) {
    //         this.datesArr = d.date;
    //       }
    //     }
    //   });
    // }

    this.dataStorage.fetchUpcomingEvents();
    this.name = this.authService.username;
    this.dataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.events = this.dataStorage.upcomingEventsList;
        console.log(this.events);
      }
    });

    this.userRole = this.authService.user;
  }
  unique(date: string[]) {
    var arr = [];

    for (var i = 0; i < date.length; i++) {
      if (!arr.includes(date[i])) {
        arr.push(date[i]);
      }
    }

    return arr;
  }

  formatDate(date: string[]) {
    if (date.length > 0) {
      var arr = this.unique(date);
      for (let d of arr) {
        this.appointmentDate += d + " " + "|" + " ";
      }
    }
    this.appointmentDate = this.appointmentDate.slice(
      0,
      this.appointmentDate.length - 2
    );
  }
}
