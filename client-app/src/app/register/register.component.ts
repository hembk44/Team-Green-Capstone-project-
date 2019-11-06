import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../auth/auth.service";
import { SignUpInfo } from "../auth/signup-info";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css","../home/administration/register-users/register-users.component.css"]
})
export class RegisterComponent implements OnInit {
  // form: any = {};
  // signupInfo: SignUpInfo;
  signupForm: FormGroup;
  signupPayload: SignUpInfo;

  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = "";
  isLoading = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      fname: new FormControl("",[Validators.required]),
      lname: new FormControl("",[Validators.required]),
      email: new FormControl("",[Validators.required, Validators.email]),
      username: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required]),
      confirmPwd: new FormControl("",[Validators.required])
    });
  }

  onSubmit() {
    const signupFormValues = this.signupForm.value;
    console.log(signupFormValues);
    if (this.signupForm.invalid) {
      return;
    }
    this.signupPayload = new SignUpInfo(
      signupFormValues.fname + " " + signupFormValues.lname,
      signupFormValues.username,
      signupFormValues.email,
      signupFormValues.password
    );
    console.log(this.signupPayload);
    this.isLoading = true;
    this.authService.signUp(this.signupPayload).subscribe(
      data => {
        console.log(data);
        this.isSignedUp = true;
        this.isLoading = false;
        this.isSignUpFailed = false;
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoading = false;

        this.isSignUpFailed = true;
      }
    );
    this.signupForm.reset();
    this.signupForm.clearValidators();
    // this.router.navigate(["login"]);
  }

  clearForm(){
    this.signupForm.reset();
    this.signupForm.clearValidators();
  }
}
