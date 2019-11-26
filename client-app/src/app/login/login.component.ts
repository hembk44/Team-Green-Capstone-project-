import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../auth/auth.service";
import { TokenStorageService } from "../auth/token-storage.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  // isLoggedIn = false;
  // isLoginFailed = false;
  // isLoading = false;

  // errorMessage = "";
  // roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  forgotPassword() {
    this.router.navigate(["forgot-password"]);
  }

  onSubmit() {
    const loginFormValues = this.loginForm.value;
    if (this.loginForm.invalid) {
      return;
    }
    const loginPayload = {
      username: loginFormValues.email,
      password: loginFormValues.password
    };

    this.authService.attemptAuth(loginPayload);
    this.authService.isLoggedIn.subscribe(result => {
      if (result) {
        // this.isLoginFailed = false;
        this.router.navigate(["home"]);
      }
      //  else if (!result) {
      //   console.log(this.isLoginFailed);

      //   this.isLoginFailed = true;
      //   console.log(this.isLoginFailed);
      // }
    });
  }
}
