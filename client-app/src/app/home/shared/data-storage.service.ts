import { Injectable } from "@angular/core";
import { AppointmentService } from "../appointment/appointment-service/appointment.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError } from "rxjs/operators";

import { Appointment } from "../appointment/appointment-interfaces/appointment";
import { throwError, Observable } from "rxjs";
import { ApiResponse } from "src/app/auth/api.response";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService
  ) {}

  // baseUrl = "localhost:8181/api/appointment/";

  // storeAppointment(appointment: Appointment) {
  //   // const appointments = this.appointmentService.getAppointments();
  //   this.http.post<Appointment>(" API URL", appointment).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  // storeAppointments() {
  //   const appointments = this.appointmentService.getAppointments();
  //   this.http.put("API URL", appointments).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  fetchAppointment(): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/faculty/allAppointments"
      )
      .pipe(catchError(this.handleError));
    // .pipe(
    //   tap(appointments => {
    //     this.appointmentService.setAppointments(appointments);
    //   })
    // );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.error.message;

    // switch (errorRes.error.error.message) {
    //   case "...":
    //     errorMessage = "...";
    // }
    return throwError(errorMessage);
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
