import { Component, OnInit, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
  selector: "app-appointment-snackbar",
  templateUrl: "./appointment-snackbar.component.html",
  styleUrls: ["./appointment-snackbar.component.css"]
})
export class AppointmentSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {}
}
