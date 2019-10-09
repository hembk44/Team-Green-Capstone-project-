import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError, finalize } from "rxjs/operators";

import { throwError, Observable, BehaviorSubject } from "rxjs";
import { ApiResponse } from "src/app/auth/api.response";
import { Appointment } from "../appointment/appointment-model/appointment.model";
import { CalEvent } from "../calendar/events.model";
import { AuthService } from 'src/app/auth/auth.service';

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

  private eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  // public apointmentList: Observable<
  //   Appointment[]
  // > = this.appointmentSubject.asObservable();

  public eventList: Observable<CalEvent[]> = this.eventSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  get appointmentLists(): Appointment[] {
    return this.appointmentSubject.value;
  }

  get eventsList(): CalEvent[] {
    return this.eventSubject.value;
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

  userSelectTimeSlot(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(
        "http://localhost:8181/api/appointment/timeslots/postSlot/" + id,
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

  fetchUserAppointment() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/user/allAppointments"
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError('there was an error'+error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200 && result.result) {
          console.log(result.result);
          this.appointmentSubject.next(result.result);
        }
      });
  }

  fetchUserAppointmentForCal() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/calendar/user"
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError('there was an error'+error)),
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
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/timeslots/faculty/" + id
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  displayUserAppointmentDetails(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/timeslots/user/" + id
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  // private handleError(errorRes: HttpErrorResponse) {
  //   let errorMessage = "An unknown error occured!";
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage);
  //   }
  //   errorMessage = errorRes.error.error.message;
  eventAPI: string = '';
  fetchEvents() {
    this.isLoadingSubject.next(true);
    if(this.authService.user === "ROLE_USER"){
      this.eventAPI = 'http://localhost:8181/api/event/user/allEvents'
    }else{
      this.eventAPI = 'http://localhost:8181/api/event/faculty/allEvents'
    }
    this.http
      .get<ApiResponse>(this.eventAPI)
      .pipe(
        (map(data => data),
        catchError(error => throwError("theres an error" + error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200 && result.result) {
          console.log(result);
          console.log(result.result);
          this.eventSubject.next(result.result);
        }
      });
  }

  storeEvent(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>("http://localhost:8181/api/event/set", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}
