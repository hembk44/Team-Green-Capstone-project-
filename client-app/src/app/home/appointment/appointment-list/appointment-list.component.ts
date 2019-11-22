import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { DataStorageService } from "../../shared/data-storage.service";
import { Appointment } from "../models-appointments/appointment.model";
import { AuthService } from "src/app/auth/auth.service";
import { AppointmentsNavigationAdminService } from "../appointments-navigation-admin.service";
import { Subscription } from "rxjs";
import { DataStorageAppointmentService } from "../data-storage-appointment.service";

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
  // appointmentsExists: boolean = false;
  private appointmentTypeSubscription: Subscription;
  constructor(
    private router: Router,
    private dataStorage: DataStorageService,
    private role: AuthService,
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService,
    private dataStorageAppointment: DataStorageAppointmentService
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    if (this.currentRole === "ROLE_USER") {
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
          console.log(status);
          if (status === "sent") {
            // console.log(this.appointmentsExists);
            this.dataStorageAppointment.fetchAppointment();
            this.dataStorageAppointment.isLoading.subscribe(loading => {
              if (!loading) {
                // this.appointmentsExists = true;
                // console.log(this.appointmentsExists);

                this.appointments = this.dataStorageAppointment.appointmentLists;
                console.log(this.appointments);
              } else {
                // this.appointmentsExists = false;
                // console.log(this.appointmentsExists);
              }
            });
          } else if (status === "received") {
            this.dataStorageAppointment.fetchUserAppointment();
            this.dataStorageAppointment.isLoading.subscribe(loading => {
              if (!loading) {
                this.appointments = this.dataStorageAppointment.appointmentLists;
              }
            });
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.appointmentTypeSubscription.unsubscribe();
  }
}
