import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { TokenStorageService } from "../auth/token-storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

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
    const passwordConfirm = {
      newPassword: formValues.newPassword,
      confirmNewPassword: formValues.confirmNewPassword
    };
    console.log(passwordConfirm);
  }
}
