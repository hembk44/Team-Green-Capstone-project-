import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../auth/auth.service";
import { TokenStorageService } from "../auth/token-storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  isLoggedIn = false;
  isLoginFailed = false;
  isLoading = false;

  errorMessage = "";
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    //   this.roles = this.tokenStorage.getAuthorities();
    // }
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  onSubmit() {
    // console.log(this.form);
    const loginFormValues = this.loginForm.value;
    if (this.loginForm.invalid) {
      return;
    }
    const loginPayload = {
      username: loginFormValues.username,
      password: loginFormValues.password
      // username: this.loginForm.controls.username.value,
      // password: this.loginForm.controls.password.value
    };

    // this.loginInfo = new AuthLoginInfo(this.form.username, this.form.password);
    this.isLoading = true;
    this.authService.attemptAuth(loginPayload).subscribe(
      data => {
        this.tokenStorage.saveToken(data.result.accessToken);
        // this.tokenStorage.saveUsername(data.username);
        // this.tokenStorage.saveAuthorities(data.authorities);
        // console.log(data);
        console.log(data);
        console.log(data.result.accessToken);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.isLoading = false;
        this.router.navigate(["home"]);

        // this.roles = this.tokenStorage.getAuthorities();
        // this.reloadPage();
      },
      errorMessage => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
        this.isLoginFailed = true;
        this.isLoading = false;
      }
    );
    // this.router.navigate(["home"]);
  }

  // reloadPage() {
  //   window.location.reload();
  // }
}
