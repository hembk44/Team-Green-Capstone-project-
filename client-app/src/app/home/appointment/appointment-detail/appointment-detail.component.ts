import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { ActivatedRoute, Router, Params } from "@angular/router";
import { Appointment } from "../models-appointments/appointment.model";
import { TimeInterval } from "../models-appointments/time-interval.model";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { EventTime } from "../../calendar/event-times.model";
import { EventDate } from "../../calendar/event-date.model";
import { AppointmentsNavigationAdminService } from "../appointments-navigation-admin.service";
import { DataStorageAppointmentService } from "../data-storage-appointment.service";
import { AppointmentDataCommunicationService } from "../appointment-data-communication.service";
import { FormControl } from "@angular/forms";
import { MatSelectionListChange, MatListOption } from "@angular/material/list";

@Component({
  selector: "app-appointment-detail",
  templateUrl: "./appointment-detail.component.html",
  styleUrls: ["./appointment-detail.component.css"]
})
export class AppointmentDetailComponent implements OnInit {
  pendingUser = new FormControl();
  appointments: any;
  detailResponse: any;
  timeslots: any[] = [];
  id: number;
  eachTimeSlot: any;
  appointmentName: string;
  appointmentDesc: string;
  appointmentLocation: string;
  currentRole: string;
  appointmentType: string;
  pendingUsers: string[] = [];
  selectedPendingRecipients: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataServiceAppointment: DataStorageAppointmentService,
    private authService: AuthService,
    private dataStorage: DataStorageService,
    private _snackBar: MatSnackBar,
    private appointmentNavigationAdmin: AppointmentsNavigationAdminService,
    private appointmentDataCoomunication: AppointmentDataCommunicationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.currentRole = this.authService.user;
      this.appointmentNavigationAdmin.appointmentStatusDetail.subscribe(
        type => {
          console.log(type);
          this.appointmentType = type;
        }
      );
      // this.appointmentDataCoomunication.appointmentData.subscribe(data => {
      //   this.appointmentName = data.title;
      //   this.appointmentDesc = data.description;
      //   this.appointmentLocation = data.location;
      // });
      if (this.currentRole === "ROLE_ADMIN") {
        console.log("admin data here!");
        if (this.appointmentType === "sent") {
          this.dataServiceAppointment
            .displayAppointmentDetails(this.id)
            .subscribe(result => {
              this.detailResponse = result.result;
              console.log(result);
              console.log(this.detailResponse);
              this.pendingUsers = this.detailResponse.pendingUsers;
              this.appointments = this.detailResponse.response;
              for (let i of this.appointments) {
                this.timeslots.push(i.response);
                this.appointmentLocation = i.location;
              }
              console.log(this.pendingUsers);
              console.log(this.appointments);
              console.log(this.timeslots);
              for (let timeslot of this.timeslots) {
                this.appointmentName = timeslot[0].appointmentName;
                this.appointmentDesc = timeslot[0].appointmentDescription;
              }
              console.log(this.appointmentName);
            });
        } else {
          // debugger;
          this.dataServiceAppointment
            .displayUserAppointmentDetails(this.id)
            .subscribe(result => {
              // this.appointments = result.result;

              console.log(result);
            });
        }
      } else {
        console.log("user data here!!!");
        this.dataServiceAppointment
          .displayUserAppointmentDetails(this.id)
          .subscribe(result => {
            // this.appointments = result.result;

            // console.log(this.appointments);
            console.log(result);
            this.appointments = result.result;
            for (let i of this.appointments) {
              this.timeslots.push(i.response);
              this.appointmentLocation = i.location;
            }
            console.log(this.appointments);
            console.log(this.timeslots);
            for (let timeslot of this.timeslots) {
              this.appointmentName = timeslot[0].appointmentName;
              this.appointmentDesc = timeslot[0].appointmentDescription;
            }
          });
      }
    });
  }

  onConfirm(id: number) {
    this.dataServiceAppointment.userSelectTimeSlot(id).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
    this._snackBar.openFromComponent(TimeSlotSnackComponent, {
      duration: 5000,
      panelClass: ["standard"]
    });
    if (this.appointmentType === "sent") {
      this.router.navigate(["./home/appointment/sent"]);
    } else {
      this.router.navigate(["./home/appointment/received"]);
    }
  }

  onSelectChange(options: MatListOption[]) {
    console.log(options.map(o => o.value));
    this.selectedPendingRecipients = options.map(o => o.value);
    // console.log(this.selectedPendingRecipients);
  }
  messageSelectedRecipients() {
    console.log(this.selectedPendingRecipients);
  }
  onDeleteAppointment(id: number) {
    this.dataServiceAppointment
      .deleteAppointment(id)
      .subscribe(r => console.log(r));
  }
  onUpdateAppointment() {
    console.log("updated");
  }
}

@Component({
  selector: "snack-bar-component-time-slot",
  templateUrl: "snack-bar-component-time-slot.html"
})
export class TimeSlotSnackComponent {}
