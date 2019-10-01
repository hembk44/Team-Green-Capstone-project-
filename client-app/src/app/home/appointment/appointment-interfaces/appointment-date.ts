import { ITimeInterval } from "./time-interval";

export interface IAppointmentDate {
  date: Date;
  times: ITimeInterval[];
}
