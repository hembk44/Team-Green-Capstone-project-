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
  navigateToType() {
    this.router.navigate(["/home/appointment/type"]);
  }

  navigateToScheduled() {
    this.router.navigate(["home/appointment/scheduled"]);
  }
}
