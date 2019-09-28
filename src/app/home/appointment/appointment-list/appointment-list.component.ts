import { Component, OnInit, Inject } from "@angular/core";

import { AppointmentService } from "../appointment-service/appointment.service";
import { Appointment } from "../appointment-model/appointment.model";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
@Component({
  selector: "app-appointment-list",
  templateUrl: "./appointment-list.component.html",
  styleUrls: ["./appointment-list.component.css"]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[];
  subscription: Subscription;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router // public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.appointmentService.appointmentChanged.subscribe(
      (newAppointments: Appointment[]) => {
        this.appointments = newAppointments;
      }
    );
    this.appointments = this.appointmentService.getAppointments();
  }
  create() {
    this.router.navigate(["home/appointment/type/create"]);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
