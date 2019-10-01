import { DateRange } from "./date-range.model";

export class Appointment {
  public name: string;
  public description: string;
  public location: string;
  public email: string[];
  public dateRange: DateRange[];

  constructor(
    name: string,
    desc: string,
    email: string[],
    loc: string,
    dateRange: DateRange[]
  ) {
    this.name = name;
    this.description = desc;
    this.location = loc;
    this.email = email;
    this.dateRange = dateRange;
  }
}
