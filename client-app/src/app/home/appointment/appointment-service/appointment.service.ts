// import { Injectable } from "@angular/core";
// // import { Appointment } from "../appointment-model/appointment.model";
// // import { DateRange } from "../appointment-model/date-range.model";
// // import { TimeInterval } from "../appointment-model/time-interval.model";
// import { Subject } from "rxjs";
// import { IAppointment } from "../appointment-interfaces/appointment";
// import { DataStorageService } from "../../shared/data-storage.service";

// @Injectable({
//   providedIn: "root"
// })
// export class AppointmentService {
//   // appointmentChanged = new Subject<Appointment[]>();
//   //slots: TimeInterval[];

//   constructor() {}
//   private appointments: Appointment[] = [];

//   // private appointments: Appointment[] = [
//   //   new Appointment(
//   //     "Fall 2019 Advising",
//   //     "for Cs students",
//   //     ["bkhb@warhawks.ulm.edu"],
//   //     [new DateRange(new Date(), [new TimeInterval("09:00", "10:00", 10)])]
//   //   ),
//   //   new Appointment(
//   //     "ACM meeting",
//   //     "for CS and CIS students",
//   //     ["jamkats@warhawks.ulm.edu"],
//   //     [new DateRange(new Date(), [new TimeInterval("11:00", "12:00", 15)])]
//   //   ),
//   //   new Appointment(
//   //     "Nepali Night",
//   //     "for NSA members",
//   //     ["bhanb@warhawks.ulm.edu"],
//   //     [new DateRange(new Date(), [new TimeInterval("01:00", "02:00", 30)])]
//   //   )
//   // ];

//   setAppointments(appointments: Appointment[]) {
//     this.appointments = appointments;
//     this.appointmentChanged.next(this.appointments.slice());
//   }

//   getAppointments() {
//     return this.appointments.slice();
//   }

//   // getAppointment(index: number) {
//   //   return this.appointments[index];
//   // }

//   // addAppointment(appointment: Appointment) {
//   //   this.appointments.push(appointment);
//   //   this.appointmentChanged.next(this.appointments.slice());
//   // }

//   // updateAppointment(index: number, newAppointment: Appointment) {
//   //   this.appointments[index] = newAppointment;
//   //   this.appointmentChanged.next(this.appointments.slice());
//   // }

//   // deleteAppointment(index: number) {
//   //   this.appointments.splice(index, 1);
//   //   this.appointmentChanged.next(this.appointments.slice());
//   // }

//   // setSlots(s: TimeInterval[]){
//   //   this.slots = s;
//   // }

//   // getSlots(){
//   //   return this.slots.slice();
//   // }
// }
