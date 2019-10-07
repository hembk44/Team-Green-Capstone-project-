import { Injectable } from "@angular/core";
// import { AppointmentService } from "../appointment/appointment-service/appointment.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError, finalize } from "rxjs/operators";

import { throwError, Observable, BehaviorSubject } from "rxjs";
import { ApiResponse } from "src/app/auth/api.response";
import { Appointment } from "../appointment/appointment-model/appointment.model";
// import { IAppointment } from "../appointment/appointment-interfaces/appointment";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();
  private appointmentSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public apointmentList: Observable<
    Appointment[]
  > = this.appointmentSubject.asObservable();

  constructor(private http: HttpClient) {}

  get appointmentLists(): Appointment[] {
    return this.appointmentSubject.value;
  }
  // baseUrl = "localhost:8181/api/appointment/";

  storeAppointment(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>("http://localhost:8181/api/appointment/set", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  fetchAppointment() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/faculty/allAppointments"
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200 && result.result) {
          this.appointmentSubject.next(result.result);
        }
      });
  }

  displayAppointmentDetails(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/timeslots/faculty/" + id
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
    // .subscribe((result: any) => {
    //   if (result) {
    //     console.log(result);
    //   }
    // });
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
}
