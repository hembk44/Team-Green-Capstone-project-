import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { ActivatedRoute, Router, Params } from "@angular/router";
import { Appointment } from "../models-appointments/appointment.model";
import { TimeInterval } from "../models-appointments/time-interval.model";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { EventTime } from "../../calendar/event-times.model";
import { EventDate } from "../../calendar/event-date.model";
import { AppointmentsNavigationAdminService } from "../appointments-navigation-admin.service";

@Component({
  selector: "app-appointment-detail",
  templateUrl: "./appointment-detail.component.html",
  styleUrls: ["./appointment-detail.component.css"]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  id: number;
  appointmentName: string;
  appointmentDesc: string;
  appointmentDate: string;
  currentRole: string;
  appointmentType: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private authService: AuthService,
    private dataStorage: DataStorageService,
    private _snackBar: MatSnackBar,
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.currentRole = this.authService.user;
      this.appointmentNavigationAdmin.appointmentStatusDetail.subscribe(
        type => {
          console.log(type);
          this.appointmentType = type;
        }
      );
      if (this.currentRole === "ROLE_ADMIN") {
        console.log("admin data here!");
        this.dataService
          .displayAppointmentDetails(this.id)
          .subscribe(result => {
            this.appointment = result.result;
            console.log(this.appointment);
            this.appointmentName = this.appointment[0].appointmentName;
            this.appointmentDesc = this.appointment[0].appointmentDescription;
            this.appointmentDate = this.appointment[0].date;
          });
      } else {
        console.log("user data here!!!");
        this.dataService
          .displayUserAppointmentDetails(this.id)
          .subscribe(result => {
            this.appointment = result.result;

            console.log(this.appointment);
          });
      }
    });
  }

  onConfirm(id: number) {
    this.dataStorage.userSelectTimeSlot(id).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
    this._snackBar.openFromComponent(TimeSlotSnackComponent, {
      duration: 5000
    });
    if (this.appointmentType === "sent") {
      this.router.navigate(["./home/appointment/sent"]);
    } else {
      this.router.navigate(["./home/appointment/received"]);
    }
  }
  onDeleteAppointment(id: number) {
    this.dataStorage.deleteAppointment(id).subscribe(r => console.log(r));
  }
  onUpdateAppointment() {
    console.log("updated");
  }
}

@Component({
  selector: "snack-bar-component-time-slot",
  templateUrl: "snack-bar-component-time-slot.html",
  styles: [
    `
      .time-slot {
        color: #800029;
        background-color: blanchedalmond;
      }
    `
  ]
})
export class TimeSlotSnackComponent {}
