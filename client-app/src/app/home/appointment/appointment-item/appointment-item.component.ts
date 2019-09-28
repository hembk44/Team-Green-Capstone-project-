import { Component, OnInit, Input } from "@angular/core";
import { Appointment } from "../appointment-model/appointment.model";
import { Identifiers } from "@angular/compiler";

@Component({
  selector: "app-appointment-item",
  templateUrl: "./appointment-item.component.html",
  styleUrls: ["./appointment-item.component.css"]
})
export class AppointmentItemComponent implements OnInit {
  @Input() appointment: Appointment;
  @Input() id: number;
  constructor() {}

  ngOnInit() {}
}
