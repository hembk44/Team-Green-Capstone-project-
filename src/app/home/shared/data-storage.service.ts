import { Injectable } from "@angular/core";
import { AppointmentService } from "../appointment/appointment-service/appointment.service";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

import { Appointment } from "../appointment/appointment-model/appointment.model";
import { TimeInterval } from '../appointment/appointment-model/time-interval.model';

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService,
  ) {}

  storeAppointment(appointment: Appointment) {
    // const appointments = this.appointmentService.getAppointments();
    this.http.post<Appointment>(" API URL", appointment).subscribe(response => {
      console.log(response);
    });
  }

  storeAppointments() {
    const appointments = this.appointmentService.getAppointments();
    this.http.put("API URL", appointments).subscribe(response => {
      console.log(response);
    });
  }

  fetchAppointment() {
    return this.http.get<Appointment[]>("API GET URL").pipe(
      tap(appointments => {
        this.appointmentService.setAppointments(appointments);
      })
    );
  }

  //gets time slots from backend. just need to update url to test
  // fetchTimeSlots(x:string) {
  //   return this.http.get<TimeInterval[]>("ec2linik:8181/api/appointments/timeslots/user/".concat(x)).pipe(
  //     tap(slots => {
  //       return slots;
  //     })
  //   );
  // }
}
