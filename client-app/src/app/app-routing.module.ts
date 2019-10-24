import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import { DashboardComponent } from "./dashboard/dashboard.component";
// import { CalendarComponent } from "./calendar/calendar.component";
// import { AppointmentComponent } from "./appointment/appointment/appointment.component";
// import { AppointmentTypeComponent } from "./appointment/appointment-type/appointment-type.component";
// import { ScheduledAppointmentComponent } from "./appointment/scheduled-appointment/scheduled-appointment.component";
// import { AppointmentStartComponent } from "./appointment/appointment-start/appointment-start.component";
// import { AppointmentDetailComponent } from "./appointment/appointment-detail/appointment-detail.component";
// import { AppointmentCreateComponent } from "./appointment/appointment-create/appointment-create.component";
// import { CreateEventComponent } from "./calendar/create-event/create-event.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from "./auth/auth.guard";
import { VerticalNavigationComponent } from "./home/vertical-navigation/vertical-navigation.component";
import { DashboardComponent } from "./home/dashboard/dashboard.component";
import { CalendarComponent } from "./home/calendar/calendar.component";
import { CreateEventComponent } from "./home/calendar/create-event/create-event.component";
import { AppointmentComponent } from "./home/appointment/appointment/appointment.component";
import { AppointmentCreateComponent } from "./home/appointment/appointment-create/appointment-create.component";
import { AppointmentDetailComponent } from "./home/appointment/appointment-detail/appointment-detail.component";
import { ScheduledAppointmentComponent } from "./home/appointment/scheduled-appointment/scheduled-appointment.component";
import { EventDetailComponent } from "./home/calendar/event-detail/event-detail.component";
import { AppointmentNavigationComponent } from "./home/appointment/appointment-navigation/appointment-navigation.component";
import { AppointmentStartComponent } from "./home/appointment/appointment-types/appointment-start/appointment-start.component";
import { AppointmentSentComponent } from "./home/appointment/appointment-types/appointment-sent/appointment-sent.component";
import { AppointmentReceivedComponent } from "./home/appointment/appointment-types/appointment-received/appointment-received.component";
import { GroupComponent } from "./home/group/group.component";
import { EditEventComponent } from "./home/calendar/create-event/edit-event/edit-event.component";
import { RegisterUsersComponent } from "./home/register-users/register-users.component";
import { ScheduledAppointmentsSentComponent } from "./home/appointment/scheduled-appointments/scheduled-appointments-sent/scheduled-appointments-sent.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },

  {
    path: "login",

    component: LoginComponent
  },
  {
    path: "signup",
    component: RegisterComponent
  },
  {
    path: "home",
    component: VerticalNavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "calendar", component: CalendarComponent },
      { path: "event/:id", component: EventDetailComponent },
      { path: "create-event", component: CreateEventComponent },
      { path: "edit-event/:id", component: EditEventComponent },
      {
        path: "appointment",
        component: AppointmentComponent,
        children: [
          { path: "", component: AppointmentStartComponent },
          {
            path: "sent",
            component: AppointmentSentComponent,
            children: [
              {
                path: "create",
                component: AppointmentCreateComponent
              },
              {
                path: ":id",
                component: AppointmentDetailComponent
              }
            ]
          },
          { path: "received", component: AppointmentReceivedComponent },
          { path: "scheduled", component: ScheduledAppointmentComponent },
          {
            path: "scheduled-appointments-sent",
            component: ScheduledAppointmentsSentComponent
          }
        ]
      },
      { path: "group", component: GroupComponent },
      { path: "register-users", component: RegisterUsersComponent }
    ]
  }
  // { path: "dashboard", component: DashboardComponent },
  // { path: "calendar", component: CalendarComponent },
  // { path: "create-event", component: CreateEventComponent },
  // {
  //   path: "appointment",
  //   component: AppointmentComponent,
  //   children: [
  //     { path: "", component: AppointmentStartComponent },
  //     {
  //       path: "type",
  //       component: AppointmentTypeComponent,
  //       children: [
  //         {
  //           path: "create",
  //           component: AppointmentCreateComponent
  //         },
  //         {
  //           path: ":id",
  //           component: AppointmentDetailComponent
  //         }
  //       ]
  //     },

  //     { path: "scheduled", component: ScheduledAppointmentComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
