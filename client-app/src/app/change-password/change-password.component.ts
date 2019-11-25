import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { TokenStorageService } from "../auth/token-storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DataStorageService } from "../home/shared/data-storage.service";
import { AppointmentSnackbarComponent } from "../home/appointment/shared-appointment/appointment-snackbar/appointment-snackbar.component";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetToken: string;

  // constructor(private route: ActivatedRoute) {
  //   console.log('Called Constructor');
  //   this.route.queryParams.subscribe(params => {
  //       this.param1 = params['param1'];
  //       this.param2 = params['param2'];
  //   });
  // }
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private _snackbar: MatSnackBar
  ) {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params["resetToken"];
      console.log(this.resetToken);
    });
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      newPassword: ["", Validators.required],
      confirmNewPassword: ["", Validators.required]
    });
  }

  onSubmit() {
    const formValues = this.forgotPasswordForm.value;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const changePasswordObject = {
      password: formValues.newPassword,
      resetToken: this.resetToken
    };
    console.log(changePasswordObject);
    this.dataStorageService
      .submitPassword(changePasswordObject)
      .subscribe(result => {
        console.log(result);
        if (result) {
          if (result.status == 200) {
            this._snackbar.openFromComponent(AppointmentSnackbarComponent, {
              duration: 5000,
              panelClass: ["standard"],
              data:
                "Your password have been changed successfully. Please login!"
            });
            this.router.navigate(["login"]);
          }
        }
      });
  }
}
