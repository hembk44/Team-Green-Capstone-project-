import { DateRange } from "./date-range.model";
import { Identifiers } from "@angular/compiler";

export class Appointment {
  public id: number;
  public name: string;
  public description: string;
  public recepients: string[];
  public dates: DateRange[];

  constructor(
    id: number,
    name: string,
    desc: string,
    email: string[],
    dateRange: DateRange[]
  ) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.recepients = email;
    this.dates = dateRange;
  }
}
