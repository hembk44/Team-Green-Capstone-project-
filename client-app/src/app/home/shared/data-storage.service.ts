import { Injectable } from "@angular/core";
// import { AppointmentService } from "../appointment/appointment-service/appointment.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, tap, catchError, finalize } from "rxjs/operators";

import { throwError, Observable, BehaviorSubject } from "rxjs";
import { ApiResponse } from "src/app/auth/api.response";
import { Appointment } from "../appointment/appointment-model/appointment.model";
<<<<<<< HEAD
import { TimeInterval } from '../appointment/appointment-model/time-interval.model';
import { CalEvent } from '../calendar/events.model';
import { EventService } from '../calendar/events.service';
=======
import { IAppointment } from "../appointment/appointment-interfaces/appointment";
>>>>>>> b8fc6e0b647c64be7db5f0fda3f2aeb659bed5e1

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
<<<<<<< HEAD
  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService,
    private eventService: EventService
  ) {}
=======
  private storeSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public storeObservable: Observable<any> = this.storeSubject.asObservable();
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();
  private appointmentSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public apointmentList: Observable<
    ApiResponse
  > = this.appointmentSubject.asObservable();

  constructor(private http: HttpClient) {}

  get store(): ApiResponse {
    return this.storeSubject.value;
  }

  get appointmentLists(): IAppointment[] {
    return this.appointmentSubject.value;
  }
  // baseUrl = "localhost:8181/api/appointment/";
>>>>>>> b8fc6e0b647c64be7db5f0fda3f2aeb659bed5e1

  storeAppointment(appointment: Appointment) {
    // const appointments = this.appointmentService.getAppointments();
    this.http
      .post<Appointment>(
        "http://localhost:8181/api/appointment/set",
        appointment
      )
      .pipe((map(data => data), catchError(error => throwError(error))))
      .subscribe((result: any) => {
        if (result) {
          return this.storeSubject.next(result);
        }
      });
  }

  // storeAppointments() {
  //   const appointments = this.appointmentService.getAppointments();
  //   this.http.put("API URL", appointments).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  fetchAppointment() {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(
        "http://localhost:8181/api/appointment/faculty/allAppointments"
      )
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200) {
          this.appointmentSubject.next(result.result);
        }
      });
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

  fetchEvents(){
    return this.http.get<CalEvent[]>("event url").pipe(
      tap(events => {
        this.eventService.setEvents(events);
      })
    );
  }

  storeEvents(){
    const events = this.eventService.getEvents();
    this.http.put("event url", events).subscribe(response => {
      console.log(response);
    });
  }
}
