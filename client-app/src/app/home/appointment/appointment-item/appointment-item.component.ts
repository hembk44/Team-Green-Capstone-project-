import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Appointment } from "../models-appointments/appointment.model";
import { DateRange } from "../models-appointments/date-range.model";
import { Router } from "@angular/router";
import { AppointmentsNavigationAdminService } from "../appointments-navigation-admin.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-appointment-item",
  templateUrl: "./appointment-item.component.html",
  styleUrls: ["./appointment-item.component.css"]
})
export class AppointmentItemComponent implements OnInit, OnDestroy {
  @Input() appointment: any;
  @Input() id: number;
  @Input() dates: DateRange[];
  status: string;
  private appointmentTypeSubscription: Subscription;

  constructor(
    private router: Router,
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService
  ) {}

  ngOnInit() {
    console.log(this.appointment);
    console.log(this.id);
    for (let date of this.dates) {
      console.log(date);
    }
    this.appointmentTypeSubscription = this.appointmentNavigationAdmin.appointmentStatusItem.subscribe(
      status => {
        this.status = status;
        console.log(this.status);
      }
    );
  }
  showDetails(index: number) {
    if (this.status === "sent") {
      this.router.navigate(["home/appointment/sent", index]);
    } else {
      this.router.navigate(["home/appointment/received", index]);
    }
  }
  ngOnDestroy() {
    // this.appointmentTypeSubscription.unsubscribe();
  }
}
