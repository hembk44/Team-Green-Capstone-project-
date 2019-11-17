import { Component, OnInit } from "@angular/core";
import { AppointmentsNavigationAdminService } from "../../appointments-navigation-admin.service";

@Component({
  selector: "app-appointment-sent",
  templateUrl: "./appointment-sent.component.html",
  styleUrls: ["./appointment-sent.component.css"]
})
export class AppointmentSentComponent implements OnInit {
  constructor(
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService
  ) {}

  ngOnInit() {
    this.appointmentNavigationAdmin.changeAppointmentStatus("sent");
    this.appointmentNavigationAdmin.changeAppointmentStatusForDetail("sent");
    this.appointmentNavigationAdmin.changeAppointmentStatusForItem("sent");
  }
}
