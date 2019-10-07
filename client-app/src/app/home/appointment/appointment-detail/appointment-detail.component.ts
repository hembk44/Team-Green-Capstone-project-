import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { ActivatedRoute, Router, Params } from "@angular/router";
import { Appointment } from "../appointment-model/appointment.model";
import { TimeInterval } from "../appointment-model/time-interval.model";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { EventTime } from '../../calendar/event-times.model';
import { EventDate } from '../../calendar/event-date.model';

@Component({
  selector: "app-appointment-detail",
  templateUrl: "./appointment-detail.component.html",
  styleUrls: ["./appointment-detail.component.css"]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  id: number;
  appointmentName: string;
  appointmentDesc: string;
  currentRole: string;
  userSelect: string;
  // timeSlots: TimeInterval[]; // = this.dataService.fetchTimeSlots(id);
  constructor(
    // private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private authService: AuthService,
    private dataStorage: DataStorageService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.currentRole = this.authService.user;
      if (this.currentRole === "ROLE_ADMIN") {
        console.log("admin data here!");
        this.dataService
          .displayAppointmentDetails(this.id)
          .subscribe(result => {
            this.appointment = result.result;
            this.userSelect = "none";
            // console.log(result);
            this.appointmentName = this.appointment[0].appointment.name;
            this.appointmentDesc = this.appointment[0].appointment.description;
            console.log(this.appointment[0].selectedBy);
            console.log(this.appointment);
          });
      } else {
        console.log("user data here!!!");
        this.dataService
          .displayUserAppointmentDetails(this.id)
          .subscribe(result => {
            this.appointment = result.result;
            // this.appointmentName = this.appointment[0].appointment.name;
            // this.appointmentDesc = this.appointment[0].appointment.description;
            console.log(this.appointment);
          });
      }
    });
  }

  onConfirm(id: number) {
    // console.log(this.id);
    this.dataStorage.userSelectTimeSlot(id).subscribe(result => {
      if (result) {
        // this.dataStorage.fetchAppointment();
        console.log(result);
      }
    });
    this._snackBar.openFromComponent(TimeSlotSnackComponent, {
      duration: 5000
    });
    this.router.navigate(["./home/appointment/type"]);
  }
  onDeleteAppointment() {
    // this.appointmentService.deleteAppointment(this.id);
    this.router.navigate(["./appointment/type"]);
  }
  onUpdateAppointment() {
    console.log("updated");
  }

//   confirmAppointment(start: string, end: string){
//     const name = this.appointmentName;
//     const date = this.appointment[0].appointment.date;
//     const eventTimes = new EventTime(start,end);
//     const evDR = new EventDate(date, [eventTimes]);
//     const desc = this.appointmentDesc;
//     const loc = 'unspecified location';

//     const obj = {
//       name: name,
//       description: desc,
//       eventdates: [evDR],
//       recepients: [''],
//       location: loc
//     }

//     this.dataService.storeEvent(obj).subscribe(result =>{ 
//       if(result) {
//         this.dataService.fetchEvents();
//       }
//     });
//   }
}

@Component({
  selector: "snack-bar-component-time-slot",
  templateUrl: "snack-bar-component-time-slot.html",
  styles: [
    `
      .time-slot {
        color: #800029;
        background-color: blanchedalmond;
      }
    `
  ]
})
export class TimeSlotSnackComponent {}
