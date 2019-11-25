import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Appointment } from "../models-appointments/appointment.model";
import { ApiResponse } from "src/app/auth/api.response";
import { catchError, map, finalize } from "rxjs/operators";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DataStorageAppointmentService {
  private baseUrlAppointment = "http://localhost:8181/api/appointment/";
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  private appointmentSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  constructor(private http: HttpClient) {}

  get appointmentLists(): Appointment[] {
    if (!this.appointmentSubject.value) {
      return [];
    } else {
      return this.appointmentSubject.value;
    }
  }

  storeAppointment(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlAppointment + "set", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  deleteAppointment(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .delete<ApiResponse>(this.baseUrlAppointment + "delete/" + id)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  userSelectTimeSlot(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(
        this.baseUrlAppointment + "timeslots/postSlot/" + id,
        id
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  fetchAppointment() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(this.baseUrlAppointment + "created/allAppointments")

      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        console.log(result);
        if (result.status == 200 && result.result) {
          this.appointmentSubject.next(result.result);
        } else {
          this.appointmentSubject.next([]);
        }
      });
  }

  fetchUserAppointment() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(this.baseUrlAppointment + "received/allAppointments")
      .pipe(
        (map(data => data),
        catchError(error => throwError("there was an error" + error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200 && result.result) {
          this.appointmentSubject.next(result.result);
          this.isLoadingSubject.next(false);
          // this.adminAppointmentReceived.next(true);
        } else {
          this.appointmentSubject.next([]);
        }
      });
  }

  fetchUserAppointmentForCal() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(this.baseUrlAppointment + "calendar/user")
      .pipe(
        (map(data => data),
        catchError(error => throwError("there was an error" + error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200 && result.result) {
          //console.log(result.result);
          this.appointmentSubject.next(result.result);
        }
      });
  }

  displayAppointmentDetails(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(this.baseUrlAppointment + "timeslots/faculty/" + id)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  displayUserAppointmentDetails(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(this.baseUrlAppointment + "timeslots/user/" + id)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  adminScheduledAppointmentsRecipients() {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(
        this.baseUrlAppointment + "getScheduledAppointmentsForAdmin"
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  userScheduledAppointments() {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(
        this.baseUrlAppointment + "getScheduledAppointmentsForUsers"
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  // send appointments to calendar
  sendApptToCal(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(this.baseUrlAppointment + "sendToCalendar/" + id, id)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  updateAppointment(obj: Object, id: number) {
    {
      this.isLoadingSubject.next(true);
      return this.http
        .put<ApiResponse>(this.baseUrlAppointment + "edit/" + id, obj)
        .pipe(
          (map(data => data), catchError(error => throwError(error))),
          finalize(() => this.isLoadingSubject.next(false))
        );
    }
  }
}
