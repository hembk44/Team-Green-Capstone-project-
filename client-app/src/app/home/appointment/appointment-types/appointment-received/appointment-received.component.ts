import { Component, OnInit } from "@angular/core";
import { AppointmentsNavigationAdminService } from "../../appointments-navigation-admin.service";

@Component({
  selector: "app-appointment-received",
  templateUrl: "./appointment-received.component.html",
  styleUrls: ["./appointment-received.component.css"]
})
export class AppointmentReceivedComponent implements OnInit {
  constructor(
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService
  ) {}

  ngOnInit() {
    this.appointmentNavigationAdmin.changeAppointmentStatus("received");
    this.appointmentNavigationAdmin.changeAppointmentStatusForDetail(
      "received"
    );
    this.appointmentNavigationAdmin.changeAppointmentStatusForItem("received");
  }
}
