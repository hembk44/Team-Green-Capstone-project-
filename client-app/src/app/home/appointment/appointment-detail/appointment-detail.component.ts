import { Component, OnInit } from "@angular/core";
// import { AppointmentService } from "../appointment-service/appointment.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Appointment } from "../appointment-model/appointment.model";
import { TimeInterval } from "../appointment-model/time-interval.model";
import { DataStorageService } from "../../shared/data-storage.service";
// import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: "app-appointment-detail",
  templateUrl: "./appointment-detail.component.html",
  styleUrls: ["./appointment-detail.component.css"]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  id: number;
  // timeSlots: TimeInterval[]; // = this.dataService.fetchTimeSlots(id);
  constructor(
    // private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.dataService.displayAppointmentDetails(this.id).subscribe(result => {
        this.appointment = result.result;
        console.log(this.appointment);
      });
      // console.log(this.appointment);
    });
  }

  onDeleteAppointment() {
    // this.appointmentService.deleteAppointment(this.id);
    this.router.navigate(["./appointment/type"]);
  }
  onUpdateAppointment() {
    console.log("updated");
  }
}
