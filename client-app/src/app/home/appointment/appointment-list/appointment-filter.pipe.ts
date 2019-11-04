import { Pipe, PipeTransform } from "@angular/core";
import { Appointment } from "../models-appointments/appointment.model";

@Pipe({
  name: "appointmentFilter"
})
export class AppointmentFilterPipe implements PipeTransform {
  transform(items: Appointment[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(appointment => {
      if (appointment.name.toLowerCase().includes(searchText)) {
        return appointment.name.toLowerCase().includes(searchText);
      } else if (appointment.description.toLowerCase().includes(searchText)) {
        return appointment.description.toLowerCase().includes(searchText);
      }
    });
  }
}
