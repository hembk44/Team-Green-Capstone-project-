import { IAppointmentDate } from "./appointment-date";

export interface IAppointment {
  id: number;
  name: string;
  description: string;
  email?: string[];
  dates: IAppointmentDate[];
}
