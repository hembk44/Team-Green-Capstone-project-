import { Component, OnInit, Input } from "@angular/core";
import { Appointment } from "../appointment-model/appointment.model";
import { DateRange } from "../appointment-model/date-range.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-appointment-item",
  templateUrl: "./appointment-item.component.html",
  styleUrls: ["./appointment-item.component.css"]
})
export class AppointmentItemComponent implements OnInit {
  @Input() appointment: Appointment;
  @Input() id: number;
  @Input() dates: DateRange[];

  constructor(private router: Router) {}

  ngOnInit() {}
  showDetails(index: number) {
    this.router.navigate(["home/appointment/type", index]);
  }
}
