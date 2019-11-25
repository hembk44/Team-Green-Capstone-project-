import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppointmentSnackbarComponent } from "../appointment/shared-appointment/appointment-snackbar/appointment-snackbar.component";

@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.component.html",
  styleUrls: ["./update-password.component.css"]
})
export class UpdatePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.updatePasswordForm = this.formBuilder.group({
      newPassword: ["", Validators.required],
      confirmNewPassword: ["", Validators.required]
    });
  }

  onSubmit() {
    const formValues = this.updatePasswordForm.value;
    if (this.updatePasswordForm.invalid) {
      return;
    }
    const updatePasswordObj = {
      password: formValues.confirmNewPassword
    };
    console.log(updatePasswordObj);
    this.dataStorageService
      .updatePassword(updatePasswordObj)
      .subscribe(result => {
        console.log(result);
        if (result) {
          if (result.status == 200) {
            this._snackbar.openFromComponent(AppointmentSnackbarComponent, {
              duration: 5000,
              panelClass: ["standard"],
              data: result.message
            });
            this.router.navigate(["home"]);
          }
        }
      });
  }
}
