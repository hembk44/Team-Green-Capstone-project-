import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Appointment } from "../models-appointments/appointment.model";
import { DateRange } from "../models-appointments/date-range.model";
import { Router } from "@angular/router";
import { AppointmentsNavigationAdminService } from "../appointments-navigation-admin.service";
import { Subscription } from "rxjs";
import { AppointmentDataCommunicationService } from "../appointment-data-communication.service";

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
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService,
    private appointmentDataCoomunication: AppointmentDataCommunicationService
  ) {}

  ngOnInit() {
    // let i = 1;
    // for (let date of this.testDates) {
    //   let length = this.testDates.length;
    //   if (length == 1) {
    //     this.appointmentDate += date;
    //   } else if (i <= length - 1) {
    //     this.appointmentDate += date + " " + "|" + " ";
    //     i++;
    //   } else {
    //     this.appointmentDate += date;
    //   }
    // }
    this.formatDate(this.dates);

    this.appointmentTypeSubscription = this.appointmentNavigationAdmin.appointmentStatusItem.subscribe(
      status => {
        this.status = status;
        // console.log(this.status);
      }
    );
  }

  formatDate(dates: string[]) {
    for (let date of dates) {
      let length = dates.length;
      if (length == 1) {
        this.appointmentDate += date;
      } else if (this.counter <= length - 1) {
        this.appointmentDate += date + " " + "|" + " ";
        this.counter++;
      } else {
        this.appointmentDate += date;
      }
    }
  }
  showDetails(index: number) {
    if (this.status === "sent") {
      this.router.navigate(["home/appointment/sent", index]);
      this.appointmentDataCoomunication.passData({
        title: this.appointmentName,
        description: this.appointmentDescription,
        location: this.appointmentLocation
      });
    } else {
      this.router.navigate(["home/appointment/received", index]);
    }
  }
  ngOnDestroy() {
    this.appointmentTypeSubscription.unsubscribe();
  }
}
