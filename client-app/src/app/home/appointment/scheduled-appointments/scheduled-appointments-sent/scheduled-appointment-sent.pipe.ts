import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "scheduledAppointmentSent"
})
export class ScheduledAppointmentSentPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    // if (isNaN(Date.parse(searchText))) alert("This is not date");
    // else alert("This is date object");
    // function getMonthInWord(date: Date) {
    //   const monthNames = [
    //     "January",
    //     "February",
    //     "March",
    //     "April",
    //     "May",
    //     "June",
    //     "July",
    //     "August",
    //     "September",
    //     "October",
    //     "November",
    //     "December"
    //   ];
    //   var m = date.getMonth();
    //   return monthNames[m];
    // }
    return items.filter(appointment => {
      // if (!isNaN(Date.parse(appointment.date))) {
      //   return appointment.appointmentName.toLowerCase().includes(searchText);
      // }

      if (appointment.appointmentName.toLowerCase().includes(searchText)) {
        return appointment.appointmentName.toLowerCase().includes(searchText);
      } else if (
        appointment.appointmentDescription.toLowerCase().includes(searchText)
      ) {
        return appointment.appointmentDescription
          .toLowerCase()
          .includes(searchText);
      } else if (appointment.selectorName.toLowerCase().includes(searchText)) {
        return appointment.selectorName.toLowerCase().includes(searchText);
      }
      // else if (!isNaN(Date.parse(appointment.date))) {
      //   return getMonthInWord(appointment.date)
      //     .toLowerCase()
      //     .includes(searchText);
      // }
    });
  }
}
