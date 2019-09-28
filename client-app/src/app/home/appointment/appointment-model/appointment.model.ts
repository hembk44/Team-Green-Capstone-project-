import { DateRange } from "./date-range.model";

export class Appointment {
  public name: string;
  public description: string;
  public email: string[];
  public dateRange: DateRange[];

  constructor(
    name: string,
    desc: string,
    email: string[],
    dateRange: DateRange[]
  ) {
    this.name = name;
    this.description = desc;
    this.email = email;
    this.dateRange = dateRange;
  }
}
