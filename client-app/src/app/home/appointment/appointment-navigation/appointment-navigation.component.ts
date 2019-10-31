import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-appointment-navigation",
  templateUrl: "./appointment-navigation.component.html",
  styleUrls: ["./appointment-navigation.component.css"]
})
export class AppointmentNavigationComponent implements OnInit {
  currentRole: string;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.currentRole = this.authService.user;
    console.log(this.currentRole);
  }
  navigateToSent() {
    this.router.navigate(["/home/appointment/sent"]);
  }

  navigateToReceive() {
    this.router.navigate(["/home/appointment/received"]);
  }

  navigateToScheduled() {
    this.router.navigate(["home/appointment/scheduled-appointments-received"]);
  }
  navigateToScheduledRecipients() {
    this.router.navigate(["home/appointment/scheduled-appointments-sent"]);
  }

  userAppointments() {
    console.log("user appointments!");
    this.router.navigate(["/home/appointment/sent"]);
  }

  userScheduledAppointments() {
    // this.router.navigate(["/home/appointment/scheduled"]);
    this.router.navigate(["home/appointment/scheduled-appointments-sent"]);

    console.log("scheduled appointments!");
  }
}
