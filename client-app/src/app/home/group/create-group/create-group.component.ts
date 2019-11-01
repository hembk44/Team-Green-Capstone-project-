import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-group",
  templateUrl: "./create-group.component.html",
  styleUrls: ["./create-group.component.css"]
})
export class CreateGroupComponent implements OnInit {
  groupForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  emails: string[] = [];
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      email: this.email
    });
  }

  addEmails() {
    this.emails.push(this.groupForm.value.email);
    console.log(this.emails);
    this.email.reset();
  }

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a valid email address"
      : this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }
  cancel() {
    this.router.navigate(["/home/group"]);
  }

  onSubmit() {
    const groupFormValues = this.groupForm.value;
    this.emails.push(this.groupForm.value.email);
    const obj = {
      name: groupFormValues.title,
      description: groupFormValues.description,
      recepients: this.emails
    };
    console.log(obj);
  }
}
