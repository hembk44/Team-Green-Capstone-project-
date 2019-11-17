import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AppointmentsNavigationAdminService {
  private appointmentStatusSubject: BehaviorSubject<
    string
  > = new BehaviorSubject<string>("nodata");

  public appointmentStatus: Observable<
    string
  > = this.appointmentStatusSubject.asObservable();

  private appointmentStatusDetailSubject: BehaviorSubject<
    string
  > = new BehaviorSubject<string>("nodata");

  public appointmentStatusDetail: Observable<
    string
  > = this.appointmentStatusDetailSubject.asObservable();

  private appointmentStatusItemSubject: BehaviorSubject<
    string
  > = new BehaviorSubject<string>("nodata");

  public appointmentStatusItem: Observable<
    string
  > = this.appointmentStatusItemSubject.asObservable();

  constructor() {}

  changeAppointmentStatus(status: string) {
    this.appointmentStatusSubject.next(status);
  }
  changeAppointmentStatusForDetail(status: string) {
    this.appointmentStatusDetailSubject.next(status);
  }

  changeAppointmentStatusForItem(status: string) {
    this.appointmentStatusItemSubject.next(status);
  }
}
