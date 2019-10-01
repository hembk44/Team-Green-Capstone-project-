import { Component, OnInit, Inject } from "@angular/core";

import { AppointmentService } from "../appointment-service/appointment.service";
// import { Appointment } from "../appointment-model/appointment.model";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Appointment } from "../appointment-interfaces/appointment";
import { DataStorageService } from "../../shared/data-storage.service";

@Component({
  selector: "app-appointment-list",
  templateUrl: "./appointment-list.component.html",
  styleUrls: ["./appointment-list.component.css"]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  appointment: Appointment;
  // subscription: Subscription;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    // this.subscription = this.appointmentService.appointmentChanged.subscribe(
    //   (newAppointments: Appointment[]) => {
    //     this.appointments = newAppointments;
    //   }
    // );
    this.dataStorage.fetchAppointment().subscribe(
      response => {
        this.appointments = <Appointment[]>response.result;
        console.log(response.result);

        // console.log(response.result[0].dates);
        // console.log(this.appointments);
        // console.log(this.appointments[0]);
      },
      err => console.log(err)
    );
  }
  create() {
    this.router.navigate(["home/appointment/type/create"]);
  }

  // castJSON(jsonObj: any) {
  //   var formattedJson = jsonObj.map(obj => {

  //   })
  // for (let obj of jsonObj) {
  // this.appointment = <Appointment>obj;
  // console.log(this.appointment);
  // this.appointments.push(this.appointment);
  // console.log(this.appointments);

  // }
  // }
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
