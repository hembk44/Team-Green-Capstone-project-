import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from "@angular/forms";
import { Router } from "@angular/router";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { GroupDataStorageService } from "../group-data-storage.service";

@Component({
  selector: "app-create-group",
  templateUrl: "./create-group.component.html",
  styleUrls: ["./create-group.component.css"]
})
export class CreateGroupComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  groupForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  emails: string[] = [];
  groupTypes: string[] = ["Course", "Custom"];
  semesterTerm: string[] = ["Fall", "Spring"];
  semesterYear: number[] = [2019, 2020, 2021];

  // use dynamic method to add values in date

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private groupDataStorageService: GroupDataStorageService
  ) {}

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      email: this.email,
      groupType: ["", Validators.required],
      semesterTerm: ["", Validators.required],
      semesterYear: ["", Validators.required]
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add emails
    if (value.trim()) {
      this.emails.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
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
    const obj = {
      name: groupFormValues.title,
      description: groupFormValues.description,
      recipients: this.emails,
      type: groupFormValues.groupType,
      semesterTerm: groupFormValues.semesterTerm,
      semesterYear: groupFormValues.semesterYear
    };
    console.log(obj);
    this.groupDataStorageService.createGroup(obj).subscribe(result => {
      if (result) {
        console.log(result);

        this.groupDataStorageService.fetchGroup();
      }
    });
  }
}
