import { Component, OnInit } from "@angular/core";
import { DataStorageService } from "src/app/home/shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { DataStorageAppointmentService } from "../../shared-appointment/data-storage-appointment.service";
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
    private dataStorageAppointment: DataStorageAppointmentService
  ) {}

  ngOnInit() {
    this.currentRole = this.authService.user;
    if (this.currentRole === "ROLE_ADMIN") {
      console.log("admin data here!");

      this.dataStorageAppointment
        .adminScheduledAppointmentsRecipients()
        .subscribe(result => {
          console.log(result);
          console.log(result.result);
          this.appointments = result.result;
        });
    } else {
      console.log("user data here!!!");
      this.dataStorageAppointment
        .userScheduledAppointments()
        .subscribe(result => {
          console.log(result.result);
          this.appointments = result.result;
        });
    }
  }
}
