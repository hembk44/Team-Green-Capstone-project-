import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-appointment-navigation",
  templateUrl: "./appointment-navigation.component.html",
  styleUrls: ["./appointment-navigation.component.css"]
})
export class AppointmentNavigationComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  navigateToSent() {
    this.router.navigate(["/home/appointment/sent"]);
  }

  navigateToReceive() {
    this.router.navigate(["/home/appointment/received"]);
  }

  navigateToScheduled() {
    this.router.navigate(["home/appointment/scheduled"]);
  }
}
