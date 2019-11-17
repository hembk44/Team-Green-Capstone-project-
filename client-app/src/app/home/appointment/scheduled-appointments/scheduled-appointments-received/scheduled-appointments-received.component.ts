import { Component, OnInit } from "@angular/core";
import { DataStorageService } from "src/app/home/shared/data-storage.service";

@Component({
  selector: "app-scheduled-appointments-received",
  templateUrl: "./scheduled-appointments-received.component.html",
  styleUrls: ["./scheduled-appointments-received.component.css"]
})
export class ScheduledAppointmentsReceivedComponent implements OnInit {
  appointments: string;
  searchText = "";
  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit() {
    this.dataStorageService.userScheduledAppointments().subscribe(result => {
      console.log(result);
      this.appointments = result.result;
    });
  }
}
