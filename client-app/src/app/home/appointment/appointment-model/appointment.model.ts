import { DateRange } from "./date-range.model";

export class Appointment {
  public name: string;
  public description: string;
  public recepients: string[];
  public dates: DateRange[];

  constructor(
    name: string,
    desc: string,
    email: string[],
    dateRange: DateRange[]
  ) {
    this.name = name;
    this.description = desc;
    this.recepients = email;
    this.dates = dateRange;
  }
}
