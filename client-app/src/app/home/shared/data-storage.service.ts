import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { map, tap, catchError, finalize, share } from "rxjs/operators";

import { throwError, Observable, BehaviorSubject } from "rxjs";
import { ApiResponse } from "src/app/auth/api.response";
import { Appointment } from "../appointment/models-appointments/appointment.model";
import { CalEvent } from "../calendar/events.model";
import { AuthService } from "src/app/auth/auth.service";
import { Calendar } from "../calendar/calendar-list/calendar.model";
import { CalendarService } from "../calendar/calendar-list/calendar.service";
import { TokenStorageService } from "src/app/auth/token-storage.service";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private baseUrlAppointment = "http://localhost:8181/api/appointment/";
  private baseUrlEvent = "http://localhost:8181/api/event/";
  private baseUrlCalendar = "http://localhost:8181/api/calendar/";

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  private appointmentSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );

  private eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private calSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private adminAppointmentReceived: BehaviorSubject<any> = new BehaviorSubject<
    any
  >({});

  public eventList: Observable<CalEvent[]> = this.eventSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private calService: CalendarService,
    private token: TokenStorageService
  ) {}

  get appointmentLists(): Appointment[] {
    if (!this.appointmentSubject.value) {
      return [];
    } else {
      return this.appointmentSubject.value;
    }
  }

  get appointmentsReceived(): Appointment[] {
    if (!this.adminAppointmentReceived.value) {
      return [];
    } else {
      return this.adminAppointmentReceived.value;
    }
  }

  get eventsList(): CalEvent[] {
    return this.eventSubject.value;
  }

  get calendars(): Calendar[] {
    return this.calSubject.value;
  }

  get users(): any[] {
    return this.userSubject.value;
  }

  registerUsers(file: File) {
    this.isLoadingSubject.next(true);
    const token = this.token.getToken();
    console.log(token);
    const headers_object = new HttpHeaders().set(
      "Authorization",
      "Bearer " + token
    );
    const httpOptions = {
      headers: headers_object
    };
    console.log(headers_object);
    // httpOptions.headers = httpOptions.headers.set(
    //   "Authorization",
    //   "Bearer " + this.token.getToken()
    // );
    // console.log(httpOptions.headers);

    var formdata: FormData = new FormData();
    formdata.append("file", file);
    console.log(formdata);
    console.log("file upload!");
    return this.http
      .post<ApiResponse>(
        "http://localhost:8181/api/file/uploadUser/faculty",
        formdata
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  storeAppointment(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http.post<ApiResponse>(this.baseUrlAppointment + "set", obj).pipe(
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

  sendApptToCal(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(this.baseUrlAppointment + "sendToCalendar/" + id, id)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  userSelectTimeSlot(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(this.baseUrlAppointment + "timeslots/postSlot/" + id, id)
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
        console.log("Faculty appointments!");
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
          console.log(result.result);
          this.appointmentSubject.next(result.result);
          this.adminAppointmentReceived.next(true);
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
      .get<ApiResponse>(this.baseUrlAppointment + "getScheduledAppointments")
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
        this.baseUrlAppointment + "getScheduledAppointmentsUser"
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
  eventAPI: string = "";
  fetchEvents() {
    this.isLoadingSubject.next(true);
    if (this.authService.user === "ROLE_USER") {
      this.eventAPI = this.baseUrlEvent + "user/allEvents";
    } else {
      this.eventAPI = this.baseUrlEvent + "faculty/allEvents";
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
    return this.http.post<Object>(this.baseUrlEvent + "set", obj).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  shareEvent(obj: Object){
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http.post<ApiResponse>(this.baseUrlEvent + 'share', obj).pipe(
      (map(data=>data),catchError(error=>throwError(error))),
      finalize(()=>this.isLoadingSubject.next(false))
    );
  }

  fetchCalendars() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(this.baseUrlCalendar + "allCalendars")
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        this.calSubject.next(result.result);
        this.calService.setCalendars(result.result);
      });
  }

  userConfirmEvent(id: number){
    this.isLoadingSubject.next(true);
    const obj = {
      id: id
    };

    return this.http.post<ApiResponse>(this.baseUrlEvent + "confirm/" + id, obj)
    .pipe(
      (map(data => data),
      catchError(error => throwError(error))),
      finalize(()=>this.isLoadingSubject.next(false))
    );
  }

  newCalendar(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(this.baseUrlCalendar + "create", obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  shareCalenar(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(this.baseUrlCalendar + "share", obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  updateCalendar(obj: Object) {
    // this.isLoadingSubject.next(true);
    // return this.http
    // .post<Object>(this.baseUrlCalendar+'edit or whatever', obj)
    // .pipe(
    //   (map(data => data),
    //   catchError(error => throwError(error)),
    //   finalize(()=>this.isLoadingSubject.next(false)))
    // );
    console.log(obj);
  }

  updateRoles(obj: Object) {
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http.put<ApiResponse>('http://localhost:8181/api/admin/changeRole', obj).pipe(
      (map(data => data),
      catchError(error => throwError(error)),
      finalize(() => this.isLoadingSubject.next(false)))
    );
  }

  deleteUsers(obj: Object) {
    console.log(obj);
    // this.isLoadingSubject.next(true);
    // return this.http.post<Object>('delete api', obj).pipe(
    //   (map(data => data),
    //   catchError(error => throwError(error)),
    //   finalize(() => this.isLoadingSubject.next(false)))
    // );
  }

  fetchUsers() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>("http://localhost:8181/api/admin/getAllUsers")
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        console.log(result.result);
        this.userSubject.next(result.result);
      });
  }

  editEvent(id: number,obj: Object) {
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http
    .post<ApiResponse>(this.baseUrlEvent+'edit/'+id, obj)
    .pipe(
      (map(data=>data),
      catchError(error => throwError(error)),
      finalize(()=>this.isLoadingSubject.next(false)))
    );
  }

  deleteEvent(id: number) {
    console.log(id);
    this.isLoadingSubject.next(false);
    return this.http
    .delete<ApiResponse>(this.baseUrlEvent+'delete/' + id)
    .pipe(
      (map(data=>data),
      catchError(error => throwError(error))),
      finalize(()=>this.isLoadingSubject.next(false)));
  }

  deleteCalendar(id: number) {
    console.log(id);
    // this.isLoadingSubject.next(false);
    // this.http.delete<ApiResponse>('delete url' + id)
    // .pipe(map(data=>data),
    // catchError(error=>throwError(error))),
    // finalize(()=>this.isLoadingSubject.next(false));
  }
}
