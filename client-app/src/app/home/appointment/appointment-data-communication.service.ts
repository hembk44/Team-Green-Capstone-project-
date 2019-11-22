import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AppointmentDataCommunicationService {
  private appointmentDataSubject: BehaviorSubject<
    appointmentDetails
  > = new BehaviorSubject<appointmentDetails>({
    title: "",
    description: "",
    location: ""
  });

  public appointmentData: Observable<
    appointmentDetails
  > = this.appointmentDataSubject.asObservable();
  constructor() {}

  passData(data: appointmentDetails) {
    this.appointmentDataSubject.next(data);
  }
}
