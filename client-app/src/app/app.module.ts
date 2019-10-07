import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// import { VerticalNavigationComponent } from "./vertical-navigation/vertical-navigation.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatNativeDateModule } from "@angular/material";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS
} from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";

// import { DashboardComponent } from "./dashboard/dashboard.component";
// import { CalendarComponent } from "./calendar/calendar.component";
// import { AppointmentComponent } from "./appointment/appointment/appointment.component";
// import { AppointmentTypeComponent } from "./appointment/appointment-type/appointment-type.component";
// import { ScheduledAppointmentComponent } from "./appointment/scheduled-appointment/scheduled-appointment.component";
// import { AppointmentStartComponent } from "./appointment/appointment-start/appointment-start.component";
// import { AppointmentItemComponent } from "./appointment/appointment-item/appointment-item.component";
// import { AppointmentNavigationComponent } from "./appointment/appointment-navigation/appointment-navigation.component";
// import { AppointmentDetailComponent } from "./appointment/appointment-detail/appointment-detail.component";
// import { AppointmentListComponent } from "./appointment/appointment-list/appointment-list.component";
// import {
//   AppointmentCreateComponent,
//   DialogDateTimeIntervalDialog,
//   DialogTimeIntervalDialog
// } from "./appointment/appointment-create/appointment-create.component";
// import { EventService } from "./calendar/events.service";
// import { CreateEventComponent } from "./calendar/create-event/create-event.component";
// import { HttpClientModule } from "@angular/common/http";
// import { CalendarListComponent } from "./calendar/calendar-list/calendar-list.component";
// import { CalendarService } from "./calendar/calendar-list/calendar.service";
// import { CalendarItemComponent } from "./calendar/calendar-list/calendar-item/calendar-item.component";
import { VerticalNavigationComponent } from "./home/vertical-navigation/vertical-navigation.component";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { CalendarComponent } from "./home/calendar/calendar.component";
import { AppointmentComponent } from "./home/appointment/appointment/appointment.component";
import { AppointmentTypeComponent } from "./home/appointment/appointment-type/appointment-type.component";
import { ScheduledAppointmentComponent } from "./home/appointment/scheduled-appointment/scheduled-appointment.component";
import { AppointmentStartComponent } from "./home/appointment/appointment-start/appointment-start.component";
import { AppointmentItemComponent } from "./home/appointment/appointment-item/appointment-item.component";
import { AppointmentNavigationComponent } from "./home/appointment/appointment-navigation/appointment-navigation.component";
import {
  AppointmentDetailComponent,
  TimeSlotSnackComponent
} from "./home/appointment/appointment-detail/appointment-detail.component";
import { AppointmentListComponent } from "./home/appointment/appointment-list/appointment-list.component";
import {
  AppointmentCreateComponent,
  DialogDateTimeIntervalDialog,
  DialogTimeIntervalDialog
} from "./home/appointment/appointment-create/appointment-create.component";
import { CreateEventComponent, EventTimeDialog, EventTimeIntervalDialog } from "./home/calendar/create-event/create-event.component";
import { CalendarListComponent } from "./home/calendar/calendar-list/calendar-list.component";
import { CalendarItemComponent } from "./home/calendar/calendar-list/calendar-item/calendar-item.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { EventService } from "./home/calendar/events.service";
import { CalendarService } from "./home/calendar/calendar-list/calendar.service";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { AuthInterceptor } from "./auth/auth-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LoadingSpinnerComponent,
    VerticalNavigationComponent,
    DashboardComponent,
    CalendarComponent,
    AppointmentComponent,
    AppointmentTypeComponent,
    ScheduledAppointmentComponent,
    AppointmentStartComponent,
    AppointmentItemComponent,
    AppointmentNavigationComponent,
    AppointmentDetailComponent,
    AppointmentListComponent,
    AppointmentCreateComponent,
    DialogDateTimeIntervalDialog,
    DialogTimeIntervalDialog,
    EventTimeDialog,
    EventTimeIntervalDialog,
    CreateEventComponent,
    CalendarListComponent,
    CalendarItemComponent,
    TimeSlotSnackComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    LayoutModule,
    MatToolbarModule,
    NgxMaterialTimepickerModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    HttpClientModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatExpansionModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  entryComponents: [
    DialogDateTimeIntervalDialog,
    DialogTimeIntervalDialog,
    EventTimeDialog,
    EventTimeIntervalDialog,
    TimeSlotSnackComponent
  ],
  providers: [
    MatDatepickerModule,
    EventService,
    CalendarService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
