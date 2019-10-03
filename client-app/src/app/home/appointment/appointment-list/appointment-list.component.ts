import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DataStorageService } from "../../shared/data-storage.service";
import { Appointment } from "../appointment-model/appointment.model";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-appointment-list",
  templateUrl: "./appointment-list.component.html",
  styleUrls: ["./appointment-list.component.css"]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  appointment: Appointment;
  currentRole: string;
  constructor(
    private router: Router,
    private dataStorage: DataStorageService,
    private role: AuthService
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    if (this.currentRole === "ROLE_USER") {
      console.log("user data here!!!");
      this.dataStorage.fetchUserAppointment();
      this.dataStorage.isLoading.subscribe(loading => {
        if (!loading) {
          this.appointments = this.dataStorage.appointmentLists;
        }
      });
    } else {
      console.log("admin data here!!!");

      // this.dataStorage.fetchAppointment();
      this.dataStorage.isLoading.subscribe(loading => {
        if (!loading) {
          this.appointments = this.dataStorage.appointmentLists;
        }
      });
    }
  }
  create() {
    this.router.navigate(["home/appointment/type/create"]);
  }
}
