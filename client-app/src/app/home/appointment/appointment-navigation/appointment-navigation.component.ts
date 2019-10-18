import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

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
    this.router.navigate(["home/appointment/scheduled"]);
  }
  navigateToScheduledRecipients() {
    this.router.navigate(["home/appointment/scheduled-recipients"]);
  }

  userAppointments() {
    console.log("user appointments!");
    this.router.navigate(["/home/appointment/sent"]);
  }

  userScheduledAppointments() {
    this.router.navigate(["/home/appointment/scheduled"]);

    console.log("scheduled appointments!");
  }
}
