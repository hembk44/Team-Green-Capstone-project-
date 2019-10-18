import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { DataStorageService } from "../../shared/data-storage.service";

@Component({
  selector: "app-scheduled-appointment",
  templateUrl: "./scheduled-appointment.component.html",
  styleUrls: ["./scheduled-appointment.component.css"]
})
export class ScheduledAppointmentComponent implements OnInit {
  currentRole: string;
  appointments: any;

  constructor(
    private authService: AuthService,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    this.currentRole = this.authService.user;
    if (this.currentRole === "ROLE_USER") {
      console.log("admin data here!");
      this.dataStorage.userScheduledAppointments().subscribe(result => {
        console.log(result.result);
        this.appointments = result.result;
      });
    }
  }
}
