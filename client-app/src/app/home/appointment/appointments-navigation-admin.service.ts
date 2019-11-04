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

  constructor() {}

  changeAppointmentStatus(status: string) {
    this.appointmentStatusSubject.next(status);
  }
}
