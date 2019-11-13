import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { GroupDataStorageService } from "../group-data-storage.service";
import { GroupCreateNavigationService } from "../group/group-create-navigation.service";
import { Group } from "../models-group/group";
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
  @ViewChild("chipList", { static: false }) chipList;

  groupForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  emails: string[] = [];
  groupTypes: string[] = ["Course", "Custom"];
  semesterTerm: string[] = ["Fall", "Spring"];
  semesterYear: number[] = [2019, 2020, 2021];
  isCourseGroup: boolean = false;
  // majors = Majors.getMajors();
  majors: string[] = [
    "Accounting",
    "Agribusiness",
    "Art",
    "Atmospheric Science",
    "Biology",
    "Business",
    "Communication",
    "Computer Information Systems",
    "Computer Science",
    "Construction Management",
    "Counseling",
    "Criminal Justice",
    "Dental Hygiene",
    "Education: Curriculum and Instruction",
    "Educational Leadership",
    "English",
    "Finance",
    "General Studies",
    "Gerontology",
    "Health Studies",
    "History",
    "Kinesiology",
    "Management",
    "Marketing",
    "Marriage & Family Therapy",
    "Mathematics",
    "Medical Laboratory Science",
    "Music",
    "Nursing",
    "Occupational Therapy",
    "Pharmacy",
    "Political Science",
    "Psychology",
    "Radiologic Technology",
    "Risk Management & Insurance",
    "Social Work",
    "Speech-Language Pathology",
    "Toxicology",
    "Unmanned Aircraft Systems Management",
    "World Langauges: French",
    "World Langauges: Spanish"
  ];

  // majorType: MajorType;
  courseGroupInfo: courseGroup[] = [];
  selectedCourseGroupDetail: courseGroup;
  selectedTitle: string;
  selectedDesc: string;
  selected: string;
  groupType: string;
  id: number;
  editMode: boolean = false;
  errorMessage: string;
  isEmailValid: boolean = false;
  groupToEdit: any;
  customGroupEmails: string[] = [];

  // use dynamic method to add values in date

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private groupDataStorageService: GroupDataStorageService,
    private groupTypeNavigation: GroupCreateNavigationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      groupType: ["", Validators.required],
      email: this.email,
      semesterTerm: ["", Validators.required],
      semesterYear: ["", Validators.required],
      majorControl: ["", Validators.required],
      editEmail: ["", Validators.required]
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

    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null;
      console.log(this.editMode);
      this.initForm();
    });
  }

  private initForm() {
    let groupEmailsArray = new FormArray([]);
    if (this.editMode) {
      this.groupDataStorageService
        .displayGroupDetails(this.id)
        .subscribe(result => {
          console.log(result);
          this.groupToEdit = result.result;
          console.log(this.groupToEdit);
          if (this.groupToEdit.type === "Custom") {
            this.isCourseGroup = false;
            this.groupForm.get("groupType").setValue(this.groupToEdit.type);
            // this.groupForm.get("title").setValue(this.groupToEdit.name);
            // this.groupForm
            //   .get("description")
            //   .setValue(this.groupToEdit.description);
            // this.groupForm
            //   .get("semesterYear")
            //   .setValue(this.groupToEdit.semesterYear);
            // this.groupForm
            //   .get("semesterTerm")
            //   .setValue(this.groupToEdit.semesterTerm);
            const customGroupMembers = this.groupToEdit.members;
            console.log(customGroupMembers);

            for (let member of customGroupMembers) {
              this.customGroupEmails.push(member.email);
              console.log(this.customGroupEmails);
            }
            // for (let email of this.customGroupEmails) {
            //   this.groupForm.get("editEmail").setValue(email);
            //   groupEmailsArray.push({
            //     new FormGroup({
            //       editEmail : new FormControl(email)
            //     })
            //   });
            // }

            this.groupForm = this.formBuilder.group({
              groupType: [this.groupToEdit.type],
              title: [this.groupToEdit.name],
              description: [this.groupToEdit.description],
              semesterTerm: [this.groupToEdit.semesterTerm],
              semesterYear: [this.groupToEdit.semesterYear]
            });
          } else {
            this.isCourseGroup = true;
            this.groupForm.get("groupType").setValue("Course");
          }
        });
    }
  }

  // createEmail(){
  //   return this.formBuilder.group{{
  //     editEmail: ['', Validators.required]
  //   }}
  // }
  get major(): any {
    return this.groupForm.get("majorControl");
  }
  deleteEmail(index: number) {
    this.customGroupEmails.splice(index, 1);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    // const value = event.value;
    this.email.setValue(event.value);
    console.log(this.email.hasError("email"));
    if (!this.email.hasError("email")) {
      // if (!this.email.hasError("email")) {
      if (this.email.value.trim()) {
        this.isEmailValid = true;
        this.emails.push(this.email.value.trim());
        this.customGroupEmails.push(this.email.value.trim());
        console.log(this.emails);
      } else if (this.email.value === "" && this.emails.length <= 0) {
        this.chipList.errorState = true;
        this.isEmailValid = false;
        this.errorMessage = "please enter a valid email address";
      } else {
        this.chipList.errorState = false;
      }
    } else {
      this.chipList.errorState = true;
      this.isEmailValid = false;
      this.errorMessage = "please enter a valid email address";
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

  // getErrorMessage() {
  //   return this.email.hasError("required")
  //     ? "You must enter a valid email address"
  //     : this.email.hasError("email")
  //     ? "Not a valid email"
  //     : "";
  // }
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
    if (this.editMode) {
      const obj = {
        name: groupFormValues.title,
        description: groupFormValues.description,
        recipients: this.customGroupEmails,
        type: groupFormValues.groupType,
        semesterTerm: groupFormValues.semesterTerm,
        semesterYear: groupFormValues.semesterYear
      };
      console.log(obj);
      this.groupDataStorageService
        .updateGroup(obj, this.id)
        .subscribe(result => {
          if (result) {
            console.log(result);

            this.groupDataStorageService.fetchGroup();
            this.router.navigate(["/home/group"]);
          }
        });
    } else {
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
          this.router.navigate(["/home/group"]);
        }
      });
    }
  }
}
