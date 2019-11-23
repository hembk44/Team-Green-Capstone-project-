import { Component, OnInit, Inject, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataStorageService } from "../../shared/data-storage.service";
import { Appointment } from "../models-appointments/appointment.model";
import { AuthService } from "src/app/auth/auth.service";
import { AppointmentsNavigationAdminService } from "../shared-appointment/appointments-navigation-admin.service";
import { Subscription } from "rxjs";
import { DataStorageAppointmentService } from "../shared-appointment/data-storage-appointment.service";
import { MatDialog, MatPaginatorModule } from "@angular/material";

@Component({
  selector: "app-appointment-list",
  templateUrl: "./appointment-list.component.html",
  styleUrls: ["./appointment-list.component.css"]
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  appointments: any[] = [];
  appointment: any;
  location: string;
  dates: string[] = [];
  currentRole: string;
  searchText = "";
  status: string = "";
  p: number = 1;
  isAppointmentEmpty: boolean = false;

  private appointmentTypeSubscription: Subscription;
  constructor(
    private router: Router,
    private dataStorage: DataStorageService,
    private role: AuthService,
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService,
    private dataStorageAppointment: DataStorageAppointmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);

    if (this.currentRole === "ROLE_USER" || this.currentRole === "ROLE_PM") {
      console.log("user data here!!!");
      this.dataStorageAppointment.fetchUserAppointment();
      this.dataStorageAppointment.isLoading.subscribe(loading => {
        console.log(loading);

        if (!loading) {
          console.log(this.dataStorageAppointment.appointmentLists);
          this.appointments = this.dataStorageAppointment.appointmentLists;
        }
      });
    } else {
      console.log("admin data here!!!");

      this.appointmentTypeSubscription = this.appointmentNavigationAdmin.appointmentStatus.subscribe(
        status => {
          if (status) {
            this.status = status;
            // console.log(this.status);
          }
        }
      );
      console.log(this.status);

      if (this.status != null) {
        if (this.status === "sent") {
          this.dataStorageAppointment.fetchAppointment();
          this.dataStorageAppointment.isLoading.subscribe(loading => {
            if (!loading) {
              this.appointments = this.dataStorageAppointment.appointmentLists;

              console.log(this.appointments);
              if (this.appointments.length <= 0) {
                this.isAppointmentEmpty = true;
              }
            }
            console.log(this.isAppointmentEmpty);
          });
        } else if (this.status === "received") {
          this.dataStorageAppointment.fetchUserAppointment();
          this.dataStorageAppointment.isLoading.subscribe(loading => {
            if (!loading) {
              this.appointments = this.dataStorageAppointment.appointmentLists;
            }
          });
        }
      }
    }
  }

  ngOnDestroy() {
    // this.appointmentTypeSubscription.unsubscribe();
  }
}
