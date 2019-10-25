import { Component, OnInit } from "@angular/core";
import { DataStorageService } from "src/app/home/shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
@Component({
  selector: "app-scheduled-appointments-sent",
  templateUrl: "./scheduled-appointments-sent.component.html",
  styleUrls: ["./scheduled-appointments-sent.component.css"]
})
export class ScheduledAppointmentsSentComponent implements OnInit {
  currentRole: string;
  appointments: any;

  constructor(
    private authService: AuthService,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    this.currentRole = this.authService.user;
    if (this.currentRole === "ROLE_ADMIN") {
      console.log("admin data here!");
      this.dataStorage
        .adminScheduledAppointmentsRecipients()
        .subscribe(result => {
          console.log(result.result);
          this.appointments = result.result;
        });
    } else {
      console.log("user data here!!!");
      this.dataStorage.userScheduledAppointments().subscribe(result => {
        console.log(result.result);
        this.appointments = result.result;
      });
    }
  }
}
