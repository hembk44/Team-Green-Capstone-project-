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
import { AppointmentTypeComponent } from "./home/appointment/appointment-type/appointment-type.component";
import { AppointmentCreateComponent } from "./home/appointment/appointment-create/appointment-create.component";
import { AppointmentDetailComponent } from "./home/appointment/appointment-detail/appointment-detail.component";
import { ScheduledAppointmentComponent } from "./home/appointment/scheduled-appointment/scheduled-appointment.component";

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
      { path: "create-event", component: CreateEventComponent },
      {
        path: "appointment",
        component: AppointmentComponent,
        children: [
          { path: "", component: AppointmentTypeComponent },
          {
            path: "type",
            component: AppointmentTypeComponent,
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

          { path: "scheduled", component: ScheduledAppointmentComponent }
        ]
      }
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
