import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { DialogShareGroup } from "src/app/home/group/group-detail/group-detail.component";
import { MatChipInputEvent } from "@angular/material/chips";
import { Validators, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DataStorageService } from "src/app/home/shared/data-storage.service";
import { MatSnackBar } from "@angular/material";
import { AppointmentSnackbarComponent } from "src/app/home/appointment/shared-appointment/appointment-snackbar/appointment-snackbar.component";

@Component({
  selector: "app-email-dialog",
  templateUrl: "./email-dialog.component.html",
  styleUrls: ["./email-dialog.component.css"]
})
export class EmailDialogComponent implements OnInit {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  constructor(
    private router: Router,
    private dataStorageService: DataStorageService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
  onSubmit() {
    // console.log(this.emailFormControl.value);
    this.dataStorageService
      .resetPassword(this.emailFormControl.value)
      .subscribe(result => {
        console.log(result);
        if (result) {
          if (result.status == 200) {
            this._snackbar.openFromComponent(AppointmentSnackbarComponent, {
              duration: 5000,
              panelClass: ["standard"],
              data: result.message
            });
          }
        }
      });
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  // saveDialogData() {
  //   this.dialogRef.close(this.emailFormControl.value);
  //   console.log(this.emailFormControl.value);
  // }
}
