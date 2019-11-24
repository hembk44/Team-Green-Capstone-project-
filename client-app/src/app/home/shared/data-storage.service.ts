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
import { Form } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private baseUrlEvent = "http://localhost:8181/api/event/";
  private baseUrlCalendar = "http://localhost:8181/api/calendar/";

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  private eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private calSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private emailSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public emails: Observable<Emails[]> = this.emailSubject.asObservable();
  private adminAppointmentReceived: BehaviorSubject<any> = new BehaviorSubject<
    any
  >({});

  public eventList: Observable<CalEvent[]> = this.eventSubject.asObservable();
  allEmails: string[];
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private calService: CalendarService
  ) {}

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

  getEmails() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>("http://localhost:8181/api/admin/getAllUsers")
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        if (result.status == 200) {
          this.emailSubject.next(result.result);
        }
      });
  }

  registerUsers(file: File) {
    this.isLoadingSubject.next(true);
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
    return this.http.post<ApiResponse>(this.baseUrlEvent + "set", obj).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  shareEvent(obj: Object) {
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http.post<ApiResponse>(this.baseUrlEvent + "share", obj).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
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

  userConfirmEvent(id: number) {
    this.isLoadingSubject.next(true);
    const obj = {
      id: id
    };

    return this.http
      .post<ApiResponse>(this.baseUrlEvent + "confirm/" + id, obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
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
    return this.http
      .put<ApiResponse>("http://localhost:8181/api/admin/changeRole", obj)
      .pipe(
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

  editEvent(id: number, obj: Object) {
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http
      .put<ApiResponse>(this.baseUrlEvent + "edit/" + id, obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  deleteEvent(id: number) {
    console.log(id);
    this.isLoadingSubject.next(false);
    return this.http
      .delete<ApiResponse>(this.baseUrlEvent + "delete/" + id)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  deleteCalendar(id: number) {
    console.log(id);
    // this.isLoadingSubject.next(false);
    // this.http.delete<ApiResponse>('delete url' + id)
    // .pipe(map(data=>data),
    // catchError(error=>throwError(error))),
    // finalize(()=>this.isLoadingSubject.next(false));
  }

  uploadMajors(formdata: FormData) {
    return this.http
      .post<ApiResponse>(
        "http://localhost:8181/api/admin/uploadCourses",
        formdata
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  emailSelectedMembers(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(
        "http://localhost:8181/api/group/" + "sendEmailToFew",
        obj
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}

export interface Emails {
  name: string;
  email: string;
  roles: string;
}
