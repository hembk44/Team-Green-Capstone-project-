import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../auth/auth.service";
import { SignUpInfo } from "../auth/signup-info";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataStorageService } from '../home/shared/data-storage.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: [
    "./register.component.css",
    "../home/administration/register-users/register-users.component.css"
  ]
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  signupPayload: SignUpInfo;

  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = "";
  isLoading = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    // this.signupForm = new FormGroup({
    //   fname: new FormControl("", [Validators.required]),
    //   lname: new FormControl("", [Validators.required]),
    //   email: new FormControl("", [Validators.required, Validators.email]),
    //   password: new FormControl("", [Validators.required]),
    //   confirmPwd: new FormControl("", [Validators.required])
    // });

    this.signupForm = this.formBuilder.group({
      role: ["", Validators.required],
      fname: ["", [Validators.required]],
      lname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      confirmPwd: ["", [Validators.required]]
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
      signupFormValues.email,
      signupFormValues.email,
      signupFormValues.password,
      [signupFormValues.role]
    );
    console.log(this.signupPayload);
    this.isLoading = true;
    this.authService.signUp(this.signupPayload).subscribe(
      data => {
        console.log(data);
        this._snackBar.open("Successfully registered!", "close", {
          duration: 3500,
          panelClass: ["standard"]
        });
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
    this.dataStorage.fetchUsers()
  }

  clearForm() {
    this.signupForm.reset();
    this.signupForm.clearValidators();
  }
}
