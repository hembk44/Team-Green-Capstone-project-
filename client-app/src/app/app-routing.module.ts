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
import { EventDetailComponent } from "./home/calendar/event-detail/event-detail.component";
import { AppointmentNavigationComponent } from "./home/appointment/appointment-navigation/appointment-navigation.component";
import { AppointmentStartComponent } from "./home/appointment/appointment-types/appointment-start/appointment-start.component";
import { AppointmentSentComponent } from "./home/appointment/appointment-types/appointment-sent/appointment-sent.component";
import { AppointmentReceivedComponent } from "./home/appointment/appointment-types/appointment-received/appointment-received.component";
import { EditEventComponent } from "./home/calendar/create-event/edit-event/edit-event.component";
import { RegisterUsersComponent } from "./home/administration/register-users/register-users.component";
import { ScheduledAppointmentsSentComponent } from "./home/appointment/scheduled-appointments/scheduled-appointments-sent/scheduled-appointments-sent.component";
import { ScheduledAppointmentsReceivedComponent } from "./home/appointment/scheduled-appointments/scheduled-appointments-received/scheduled-appointments-received.component";
import { GroupListComponent } from "./home/group/group-list/group-list.component";
import { GroupComponent } from "./home/group/group/group.component";
import { GroupStartComponent } from "./home/group/group-start/group-start.component";
import { CreateGroupComponent } from "./home/group/create-group/create-group.component";
import { GroupDetailComponent } from "./home/group/group-detail/group-detail.component";
import { AdministrationComponent } from "./home/administration/administration.component";
import { GroupEditComponent } from "./home/group/group-edit/group-edit.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { BroadcastComponent } from "./broadcast/broadcast.component";
import { BroadcastManagementComponent } from "./home/administration/broadcast-management/broadcast-management.component";
import { UserManualComponent } from "./home/vertical-navigation/user-manual/user-manual.component";
import { AdminComponent } from "./home/vertical-navigation/user-manual/admin/admin.component";
import { ApptComponent } from "./home/vertical-navigation/user-manual/appt/appt.component";
import { BrdcastComponent } from "./home/vertical-navigation/user-manual/brdcast/brdcast.component";
import { CalComponent } from "./home/vertical-navigation/user-manual/cal/cal.component";
import { GrpsComponent } from "./home/vertical-navigation/user-manual/grps/grps.component";
import { ManualStartComponent } from "./home/vertical-navigation/user-manual/manual-start/manual-start.component";
import { YourGroupComponent } from "./home/group/your-group/your-group.component";
import { EmailDialogComponent } from "./shared/email-dialog/email-dialog.component";
import { UpdatePasswordComponent } from "./home/update-password/update-password.component";

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
    path: "forgot-password",

    component: EmailDialogComponent
  },
  {
    path: "reset-password",

    component: ChangePasswordComponent
  },
  {
    path: "home",
    component: VerticalNavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "update-password", component: UpdatePasswordComponent },

      {
        path: "user-manual",
        component: UserManualComponent,
        children: [
          { path: "", component: ManualStartComponent },
          { path: "administration", component: AdminComponent },
          { path: "appointments", component: ApptComponent },
          { path: "broadcast", component: BrdcastComponent },
          { path: "calendar", component: CalComponent },
          { path: "groups", component: GrpsComponent }
        ]
      },
      { path: "admin", component: AdministrationComponent },
      { path: "broadcast-management", component: BroadcastManagementComponent },
      { path: "calendar", component: CalendarComponent },
      { path: "event/:id", component: EventDetailComponent },
      { path: "create-event", component: CreateEventComponent },
      { path: "edit-event/:id", component: EditEventComponent },
      {
        path: "appointment",
        component: AppointmentComponent,
        children: [
          { path: "", redirectTo: "sent", pathMatch: "full" },
          {
            path: "create",
            component: AppointmentCreateComponent
          },
          {
            path: "sent",
            component: AppointmentSentComponent,
            children: [
              {
                path: ":id",
                component: AppointmentDetailComponent
              }
            ]
          },
          {
            path: "edit-appointment/:id",
            component: AppointmentCreateComponent
          },
          {
            path: "received",
            component: AppointmentReceivedComponent,
            children: [
              {
                path: ":id",
                component: AppointmentDetailComponent
              }
            ]
          },
          { path: "scheduled", component: ScheduledAppointmentsSentComponent },
          {
            path: "scheduled-appointments-received",
            component: ScheduledAppointmentsReceivedComponent
          },

          {
            path: "scheduled-appointments-sent",
            component: ScheduledAppointmentsSentComponent
          }
        ]
      },
      {
        path: "group",
        component: GroupComponent,
        children: [
          { path: "", redirectTo: "your-group", pathMatch: "full" },
          { path: "create-group", component: CreateGroupComponent },
          {
            path: "your-group",
            component: YourGroupComponent,
            children: [
              { path: "", component: GroupStartComponent },

              { path: "create-group", component: CreateGroupComponent },
              { path: ":id", component: GroupDetailComponent }

              // { path: ":id/edit", component: CreateGroupComponent }
            ]
          },
          { path: "edit-group/:id", component: CreateGroupComponent }
        ]
      }
    ]
  },
  { path: "broadcast", component: BroadcastComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
