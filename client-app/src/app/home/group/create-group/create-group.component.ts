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
import { GroupCreateNavigationService } from "../group/group-create-navigation.service";
// import { Majors, MajorType } from "./majors";

export interface courseGroup {
  title: string;
  description: string;
}

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
  isCourseGroup: boolean = false;
  // majors = Majors.getMajors();
  majors: string[] = ["Computer Science", "Computer Information System"];
  // majorType: MajorType;
  courseGroupInfo: courseGroup[] = [];
  selectedCourseGroupDetail: courseGroup;
  selectedTitle: string;
  selectedDesc: string;
  selected: string;
  groupType: string;

  // use dynamic method to add values in date

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private groupDataStorageService: GroupDataStorageService,
    private groupTypeNavigation: GroupCreateNavigationService
  ) {}

  ngOnInit() {
    console.log(this.majors);
    this.groupForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      groupType: ["", Validators.required],
      email: this.email,
      semesterTerm: ["", Validators.required],
      semesterYear: ["", Validators.required],
      majorControl: ["", Validators.required]
    });

    this.groupTypeNavigation.groupType.subscribe(type => {
      this.groupType = type;
      if (this.groupType === "course") {
        this.isCourseGroup = true;
        this.groupForm.get("groupType").setValue("Course");
      } else {
        this.isCourseGroup = false;
        this.groupForm.get("groupType").setValue("Custom");
      }
    });

    // const groupFormValues = this.groupForm.value;
    // console.log(this.isCourseGroup);
    // console.log(groupFormValues.majorControl);
    // console.log(this.selected);
    // console.log(this.major);
    // if (this.selected === "Computer Science") {
    //   this.isCourseGroup = true;
    //   console.log(this.isCourseGroup);
    //   this.courseGroupInfo = [
    //     { title: "CSCI 1070", description: "Computer Literacy" },
    //     {
    //       title: "CSCI 4060",
    //       description: "Principles of Software Engineering"
    //     }
    //   ];
    // }
  }

  get major(): any {
    return this.groupForm.get("majorControl");
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
  // click() {
  //   console.log(this.major);
  // }
  onMajorChanged(event: any) {
    // console.log(MajorType[event.value]);
    console.log(event.value);
    if (event.value === "Computer Science") {
      // console.log("success!");
      this.courseGroupInfo = [
        { title: "CSCI 4060", description: "Software engineering" },
        {
          title: "CSCI 4055",
          description: "Theory Of Data Base Management Systems"
        },
        { title: "CSCI 4063", description: "Theory of Programming Languages" }
      ];
    } else {
      this.courseGroupInfo = [];
    }
  }

  onTitleChanged(event: any) {
    this.selectedTitle = event.value;
    console.log(this.selectedTitle);
    this.selectedCourseGroupDetail = this.courseGroupInfo.find(
      i => i.title === this.selectedTitle
    );
    this.groupForm
      .get("description")
      .setValue(this.selectedCourseGroupDetail.description);
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
