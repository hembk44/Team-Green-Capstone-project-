import { TimeInterval } from "./time-interval.model";

export class DateRange {
  public date: string;
  public apptimes: TimeInterval[];

  constructor(appointmentDate: string, timeInterval: TimeInterval[]) {
    this.date = appointmentDate;
    this.apptimes = timeInterval;
  }
}
