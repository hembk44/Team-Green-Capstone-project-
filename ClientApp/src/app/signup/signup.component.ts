import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../service/api.service";
import { User } from "../model/user.model";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  signupPayload: User;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      confirmPwd: [""]
    });
  }

  onSubmit() {
    const signupFormValues = this.signupForm.value;
    console.log(signupFormValues);
    if (this.signupForm.invalid) {
      return;
    }

    this.signupPayload = {
      firstName: signupFormValues.fname,
      lastName: signupFormValues.lname,
      username: signupFormValues.email,
      password: signupFormValues.password
    };

    this.apiService
      .createUser(this.signupPayload)
      .subscribe(data => console.log(data));
  }
}
