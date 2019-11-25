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
import { P } from "@angular/cdk/keycodes";
import { Form } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private baseUrlEvent = "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/event/";
  private baseUrlCalendar = "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/calendar/";
  private baseUrlAdmin = "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/admin/"

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  private eventSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private calSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private imageSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private emailSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public emails: Observable<Emails[]> = this.emailSubject.asObservable();
  private adminAppointmentReceived: BehaviorSubject<any> = new BehaviorSubject<
    any
  >({});

  private majorSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

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

  get images() {
    return this.imageSubject.value;
  }

  get eventsList(): CalEvent[] {
    return this.eventSubject.value;
  }

  get calendars(): Calendar[] {
    return this.calSubject.value;
  }

  get users(): any[] {
    console.log(this.userSubject.value === {});
    if (this.userSubject.value.length !== {}) {
      return this.userSubject.value;
    } else {
      return [];
    }
  }

  get majors(): any[] {
    console.log(this.majorSubject.value);
    if (this.majorSubject.value !== {}) {
      return this.majorSubject.value;
    } else {
      return [];
    }
  }

  getEmails() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>("http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/admin/getAllUsers")
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

  resetPassword(email: string) {
    this.isLoadingSubject.next(true);
    var formdata: FormData = new FormData();
    formdata.append("email", email);
    return this.http
      .post<ApiResponse>("http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/auth/forgot", formdata)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  submitPassword(obj: Object) {
    this.isLoadingSubject.next(true);

    return this.http
      .post<ApiResponse>(
        "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/auth/processResetPassword",
        obj
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  updatePassword(obj: Object) {
    this.isLoadingSubject.next(true);

    return this.http
      .put<ApiResponse>("http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/admin/changePassword", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  registerUsers(file: File, role: string) {
    this.isLoadingSubject.next(true);
    var formdata: FormData = new FormData();
    formdata.append("file", file);
    console.log(formdata);
    console.log("file upload!");
    return this.http
      .post<ApiResponse>(
        "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/file/uploadUser/"+role,
        formdata
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  uploadImage(images): Observable<any> {
    console.log(images);
    var temp = [];
    const formData = new FormData();
    // for (let i = 0 ; i < images.length ; i++) {
    //   formData.append("file", images[i]);
    // }
    for (let img of images) {
      formData.append("file", img);
    }
    console.log(formData.get("file"));
    //this.isLoadingSubject.next(true);
    // return this.http.post<ApiResponse>(this.baseUrlAdmin+'uploadImage', image).pipe(
    //   (map(data=>data)),
    //   catchError(error => throwError(error)),
    //   finalize(()=>this.isLoadingSubject.next(false))
    // ).subscribe(result => {
    //   this.imageSubject.next(result.result);
    // });
    console.log(formData.get("file"));
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlAdmin + "uploadImages", formData)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getImgName() {
    this.isLoadingSubject.next(true);
    return this.http.get<ApiResponse>(this.baseUrlAdmin + "getallfiles").pipe(
      map(data => data),
      catchError(error => throwError(error)),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getImageByName(name: string) {
    return this.http.get<ApiResponse>(this.baseUrlAdmin + "files/" + name);
  }

  getImages(): Observable<any>{
    return this.http.get('http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/auth/getImages');
  }

  addCourses(formData: FormData) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlAdmin + "uploadCourses", formData)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getMajors() {
    this.isLoadingSubject.next(true);
    this.http.get<ApiResponse>('http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/group/getAllMajors').pipe(
      (map(data=>data), catchError(error => throwError(error))),
      finalize(()=>this.isLoadingSubject.next(false))
    ).subscribe(result => {
      this.majorSubject.next(result.result);
    });
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

  uploadMajors(formdata: FormData) {
    return this.http
      .post<ApiResponse>(
        "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/admin/uploadCourses",
        formdata
      )
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  newCalendar(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlCalendar + "create", obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  shareCalenar(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlCalendar + "share", obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  updateCalendar(obj: Object, id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .put<ApiResponse>(this.baseUrlCalendar + "edit/" + id, obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  updateRoles(obj: Object) {
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http
      .put<ApiResponse>(this.baseUrlAdmin + "changeRole", obj)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  uploadMajors2() {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlAdmin + "uploadMajor", "")
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  deleteUsers(obj: string[]) {
    console.log(obj);
    this.isLoadingSubject.next(true);
    return this.http.post<ApiResponse>(this.baseUrlAdmin+'deleteUser', obj).pipe(
      (map(data => data),
      catchError(error => throwError(error)),
      finalize(() => this.isLoadingSubject.next(false)))
    );
  }

  fetchUsers() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(this.baseUrlAdmin + "getAllUsers")
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
    this.isLoadingSubject.next(true);
    return this.http
      .delete<ApiResponse>(this.baseUrlCalendar + "delete/" + id)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  emailSelectedMembers(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(
        "http://ec2-100-26-194-180.compute-1.amazonaws.com:8181/api/group/" + "sendEmailToFew",
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
