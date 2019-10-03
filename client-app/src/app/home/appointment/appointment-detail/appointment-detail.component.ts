import { Component, OnInit } from "@angular/core";

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
  // timeSlots: TimeInterval[]; // = this.dataService.fetchTimeSlots(id);
  constructor(
    // private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private authService: AuthService
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
            this.appointmentName = this.appointment[0].appointment.name;
            this.appointmentDesc = this.appointment[0].appointment.description;

            console.log(this.appointment);
          });
      }
      console.log("user data here!!!");
      this.dataService
        .displayUserAppointmentDetails(this.id)
        .subscribe(result => {
          this.appointment = result.result;
          this.appointmentName = this.appointment[0].appointment.name;
          this.appointmentDesc = this.appointment[0].appointment.description;

          console.log(this.appointment);
        });
    });
  }

  onDeleteAppointment() {
    // this.appointmentService.deleteAppointment(this.id);
    this.router.navigate(["./appointment/type"]);
  }
  onUpdateAppointment() {
    console.log("updated");
  }

  confirmAppointment(start: string, end: string){
    const name = this.appointmentName;
    const date = this.appointment[0].appointment.date;
    const eventTimes = new EventTime(start,end);
    const evDR = new EventDate(date, [eventTimes]);
    const desc = this.appointmentDesc;
    const loc = 'unspecified location';

    const obj = {
      name: name,
      description: desc,
      eventdates: [evDR],
      recepients: [''],
      location: loc
    }

    this.dataService.storeEvent(obj).subscribe(result =>{ 
      if(result) {
        this.dataService.fetchEvents();
      }
    });
  }
}
