import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Appointment } from "../models-appointments/appointment.model";
import { DateRange } from "../models-appointments/date-range.model";
import { Router } from "@angular/router";
import { AppointmentsNavigationAdminService } from "../shared-appointment/appointments-navigation-admin.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-appointment-item",
  templateUrl: "./appointment-item.component.html",
  styleUrls: ["./appointment-item.component.css"]
})
export class AppointmentItemComponent implements OnInit, OnDestroy {
  @Input() appointmentName: string;
  @Input() appointmentDescription: string;
  @Input() appointmentLocation: string;
  @Input() id: number;
  @Input() dates: any[];
  counter: number = 1;
  appointmentDate: string = "";
  status: string;
  private appointmentTypeSubscription: Subscription;

  constructor(
    private router: Router,
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService
  ) {}

  ngOnInit() {
    this.formatDate(this.dates);
    console.log(this.dates);

    this.appointmentTypeSubscription = this.appointmentNavigationAdmin.appointmentStatusItem.subscribe(
      status => {
        this.status = status;
      }
    );
  }

  // formatDate(dates: string[]) {
  //   let length = dates.length;
  //   for (let date of dates) {

  //     if (length == 1) {
  //       this.appointmentDate += date;
  //       console.log(this.appointmentDate);
  //     } else if (this.counter <= length - 1 && !dates.includes(date)) {
  //       this.appointmentDate += date + " " + "|" + " ";
  //       console.log(this.appointmentDate);

  //       this.counter++;
  //     } else if (this.counter <= length - 1 && dates.includes(date)) {
  //       this.appointmentDate += this.appointmentDate + " ";
  //       console.log(this.appointmentDate);

  //       this.counter++;
  //     }
  //   }
  // }

  unique(date: string[]) {
    var arr = [];

    for (var i = 0; i < date.length; i++) {
      if (!arr.includes(date[i])) {
        arr.push(date[i]);
      }
    }

    return arr;
  }

  formatDate(date: string[]) {
    if (date.length > 0) {
      var arr = this.unique(date);
      for (let d of arr) {
        this.appointmentDate += d + " " + "|" + " ";
      }
    }
    this.appointmentDate = this.appointmentDate.slice(
      0,
      this.appointmentDate.length - 2
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
    this.appointmentTypeSubscription.unsubscribe();
  }
}
