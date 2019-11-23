import { Component, OnInit } from "@angular/core";
import { DataStorageAppointmentService } from "../../shared-appointment/data-storage-appointment.service";

@Component({
  selector: "app-scheduled-appointments-received",
  templateUrl: "./scheduled-appointments-received.component.html",
  styleUrls: ["./scheduled-appointments-received.component.css"]
})
export class ScheduledAppointmentsReceivedComponent implements OnInit {
  appointments: string;
  searchText = "";
  constructor(private dataStorageAppointment: DataStorageAppointmentService) {}

  ngOnInit() {
    this.dataStorageAppointment
      .userScheduledAppointments()
      .subscribe(result => {
        console.log(result);
        this.appointments = result.result;
      });
  }
}
