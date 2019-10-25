import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AppointmentComponent } from "./appointment/appointment.component";
import { AppointmentItemComponent } from "./appointment-item/appointment-item.component";
import { AppointmentNavigationComponent } from "./appointment-navigation/appointment-navigation.component";
import { AppointmentDetailComponent } from "./appointment-detail/appointment-detail.component";
import { AppointmentListComponent } from "./appointment-list/appointment-list.component";
import {
  AppointmentCreateComponent,
  DialogDateTimeIntervalDialog,
  DialogTimeIntervalDialog
} from "./appointment-create/appointment-create.component";
import { AppointmentStartComponent } from "./appointment-types/appointment-start/appointment-start.component";
import { AppointmentSentComponent } from "./appointment-types/appointment-sent/appointment-sent.component";
import { AppointmentReceivedComponent } from "./appointment-types/appointment-received/appointment-received.component";
import { ScheduledAppointmentsSentComponent } from "./scheduled-appointments/scheduled-appointments-sent/scheduled-appointments-sent.component";
import { ScheduledAppointmentsReceivedComponent } from "./scheduled-appointments/scheduled-appointments-received/scheduled-appointments-received.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    AppointmentComponent,
    AppointmentItemComponent,
    AppointmentNavigationComponent,
    AppointmentDetailComponent,
    AppointmentListComponent,
    AppointmentCreateComponent,
    DialogDateTimeIntervalDialog,
    DialogTimeIntervalDialog,
    AppointmentStartComponent,
    AppointmentSentComponent,
    AppointmentReceivedComponent,
    ScheduledAppointmentsSentComponent,
    ScheduledAppointmentsReceivedComponent,
    DialogDateTimeIntervalDialog,
    DialogTimeIntervalDialog
  ],
  entryComponents: [DialogDateTimeIntervalDialog, DialogTimeIntervalDialog],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [
    AppointmentComponent,
    AppointmentItemComponent,
    AppointmentNavigationComponent,
    AppointmentDetailComponent,
    AppointmentListComponent,
    AppointmentCreateComponent,
    DialogDateTimeIntervalDialog,
    DialogTimeIntervalDialog,
    AppointmentStartComponent,
    AppointmentSentComponent,
    AppointmentReceivedComponent,
    ScheduledAppointmentsSentComponent,
    ScheduledAppointmentsReceivedComponent,
    DialogDateTimeIntervalDialog,
    DialogTimeIntervalDialog
  ]
})
export class AppointmentModule {}
