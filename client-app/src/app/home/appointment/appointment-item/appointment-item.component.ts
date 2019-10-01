import { Component, OnInit, Input } from "@angular/core";
// import { Appointment } from "../appointment-model/appointment.model";
import { Identifiers } from "@angular/compiler";
import { IAppointment } from "../appointment-interfaces/appointment";
import { IAppointmentDate } from "../appointment-interfaces/appointment-date";

@Component({
  selector: "app-appointment-item",
  templateUrl: "./appointment-item.component.html",
  styleUrls: ["./appointment-item.component.css"]
})
export class AppointmentItemComponent implements OnInit {
  @Input() appointment: IAppointment;
  @Input() id: number;
  @Input() dates: IAppointmentDate[];

  constructor() {}

  ngOnInit() {}
}
