import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TokenStorageService } from "src/app/auth/token-storage.service";

@Component({
  selector: "app-no-appointment-dialog",
  templateUrl: "./no-appointment-dialog.component.html",
  styleUrls: ["./no-appointment-dialog.component.css"]
})
export class NoAppointmentDialogComponent implements OnInit {
  username: string = "";
  constructor(
    public dialogRef: MatDialogRef<NoAppointmentDialogComponent>,
    private token: TokenStorageService
  ) {}

  ngOnInit() {
    this.username = this.token.getName();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
