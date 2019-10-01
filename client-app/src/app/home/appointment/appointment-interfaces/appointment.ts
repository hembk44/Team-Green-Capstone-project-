import { AppointmentDate } from "./appointment-date";

export interface Appointment {
  id: number;
  name: string;
  description: string;
  // email: string[];
  dates: AppointmentDate[];
}
