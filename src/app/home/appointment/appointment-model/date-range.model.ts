import { TimeInterval } from "./time-interval.model";

export class DateRange {
  public appointmentDate: Date;
  public timeInterval: TimeInterval[];

  constructor(appointmentDate: Date, timeInterval: TimeInterval[]) {
    this.appointmentDate = appointmentDate;
    this.timeInterval = timeInterval;
  }
}
