import { Component, OnInit } from "@angular/core";
import { DataStorageService } from "src/app/home/shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { DataStorageAppointmentService } from "../../shared-appointment/data-storage-appointment.service";
import { MatSnackBar } from "@angular/material";
import { AppointmentSnackbarComponent } from "../../shared-appointment/appointment-snackbar/appointment-snackbar.component";
@Component({
  selector: "app-scheduled-appointments-sent",
  templateUrl: "./scheduled-appointments-sent.component.html",
  styleUrls: ["./scheduled-appointments-sent.component.css"]
})
export class ScheduledAppointmentsSentComponent implements OnInit {
  currentRole: string;
  appointments: any;
  searchText = "";

  constructor(
    private authService: AuthService,
    private dataStorageAppointment: DataStorageAppointmentService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentRole = this.authService.user;
    if (this.currentRole === "ROLE_ADMIN" || this.currentRole === "ROLE_PM") {
      console.log("admin data here!");

      this.dataStorageAppointment
        .adminScheduledAppointmentsRecipients()
        .subscribe(result => {
          console.log(result);
          console.log(result.result);
          this.appointments = result.result;
          if (result.result) {
            this.appointments = result.result;
          } else {
            this._snackbar.open(result.message, "close", {
              duration: 5000,
              panelClass: ["delete"]
            });
          }
        });
    } else {
      console.log("user data here!!!");
      this.dataStorageAppointment
        .userScheduledAppointments()
        .subscribe(result => {
          if (result.result) {
            this.appointments = result.result;
          } else {
            this._snackbar.open(result.message, "close", {
              duration: 5000,
              panelClass: ["delete"]
            });
          }
          console.log(result);
        });
    }
  }
}
