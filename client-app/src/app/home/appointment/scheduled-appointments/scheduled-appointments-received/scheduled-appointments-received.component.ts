import { Component, OnInit } from "@angular/core";
import { DataStorageAppointmentService } from "../../shared-appointment/data-storage-appointment.service";
import { MatSnackBar } from "@angular/material";
import { AppointmentSnackbarComponent } from "../../shared-appointment/appointment-snackbar/appointment-snackbar.component";

@Component({
  selector: "app-scheduled-appointments-received",
  templateUrl: "./scheduled-appointments-received.component.html",
  styleUrls: ["./scheduled-appointments-received.component.css"]
})
export class ScheduledAppointmentsReceivedComponent implements OnInit {
  appointments: string;
  searchText = "";
  constructor(
    private dataStorageAppointment: DataStorageAppointmentService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
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

        // if (result.status == 200) {
        //   this.appointments = result.result;
        // }
        // if (result.status == 404) {
        //   this._snackbar.openFromComponent(AppointmentSnackbarComponent, {
        //     duration: 4000,
        //     panelClass: ["delete"],
        //     data: result.message
        //   });
        // }
        console.log(result);
      });
  }
}
