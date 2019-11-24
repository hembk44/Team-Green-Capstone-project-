import { Component, OnInit, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
  selector: "app-group-snackbar",
  templateUrl: "./group-snackbar.component.html",
  styleUrls: ["./group-snackbar.component.css"]
})
export class GroupSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public groupMessage: string) {}

  ngOnInit() {}
}
