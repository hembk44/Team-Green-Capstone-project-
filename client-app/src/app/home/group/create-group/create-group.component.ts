import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { GroupDataStorageService } from "../group-data-storage.service";
import { GroupCreateNavigationService } from "../group/group-create-navigation.service";
import {
  MatSelectChange,
  MatSelect,
  MatSnackBar,
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { Observable } from "rxjs";
import { DataStorageService, Emails } from "../../shared/data-storage.service";
import { startWith, map } from "rxjs/operators";

export interface courseGroup {
  id: number;
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
  selectedOption = "";
  filteredUserList: Observable<string[]>;
  userList: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // @ViewChild("chipList", { static: false }) chipList;
  @ViewChild("userInput", { static: false }) userInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  groupForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  groupMembersEmails: string[] = [];
  groupTypes: string[] = ["Course", "Custom"];
  semesterTerm: string[] = ["Fall", "Spring"];

  currentYear: number = new Date().getFullYear();
  semesterYear: number[] = [
    this.currentYear - 2,
    this.currentYear - 1,
    this.currentYear,
    this.currentYear + 1,
    this.currentYear + 2
  ];
  isCourseGroup: boolean = false;
  selectedTitle: string;
  groupType: string;
  id: number;
  editMode: boolean = false;
  errorMessage: string;
  isEmailValid: boolean = false;
  groupToEdit: any;
  customGroupEmails: string[] = [];
  courseGroupEmails: string[] = [];

  validFileExtensions: string[] = ["xlsx", "csv"];
  invalidExtension: string;
  isInvalid: boolean = false;

  selectedFiles: FileList;
  currentFileUpload: File;
  source: MatSelect;
  allMajors: any[] = [];
  courseDetails: courseGroup[] = [];
  selectedCourseGroupDetail: courseGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private groupDataStorageService: GroupDataStorageService,
    private groupTypeNavigation: GroupCreateNavigationService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dataStorage: DataStorageService
  ) {
    this.dataStorage.getEmails();
    this.dataStorage.emails.subscribe((result: Emails[]) => {
      if (result.length > 0) {
        result.forEach(o => {
          if (!this.userList.includes(o.email)) {
            this.userList.push(o.email);
          }
        });
      }
    });

    this.filteredUserList = this.email.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.userList.slice()
      )
    );
  }
  filter(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();
    return this.userList.filter(user =>
      user.toLocaleLowerCase().includes(filterValue)
    );
  }

  ngOnInit() {
    this.groupDataStorageService.getAllMajors();
    this.groupDataStorageService.isLoading.subscribe(loading => {
      if (!loading) {
        this.allMajors = this.groupDataStorageService.majors;
        console.log(this.allMajors);
      }
    });

    this.groupForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      groupType: ["", Validators.required],
      email: this.email,
      semesterTerm: ["", Validators.required],
      semesterYear: ["", Validators.required],
      majorControl: ["", Validators.required],
      editEmail: ["", Validators.required],
      uploadFile: [undefined, [Validators.required]]
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
    if (this.editMode) {
      this.groupDataStorageService
        .displayGroupDetails(this.id)
        .subscribe(result => {
          console.log(result);
          this.groupToEdit = result.result;
          console.log(this.groupToEdit);

          if (this.groupToEdit.type === "Custom") {
            this.selectedOption = "email";

            this.isCourseGroup = false;
            this.groupForm.get("groupType").setValue(this.groupToEdit.type);

            const customGroupMembers = this.groupToEdit.members;
            for (let member of customGroupMembers) {
              this.groupMembersEmails.push(member.email);
            }
            this.groupForm = this.formBuilder.group({
              groupType: [this.groupToEdit.type],
              title: [this.groupToEdit.name],
              description: [this.groupToEdit.description],
              semesterTerm: [this.groupToEdit.semesterTerm],
              semesterYear: [this.groupToEdit.semesterYear]
            });
          } else {
            this.selectedOption = "email";
            this.isCourseGroup = true;
            this.groupForm.get("groupType").setValue("Course");
            console.log(this.groupToEdit.major.name);
            const major = this.groupToEdit.major.name;
            this.onMajorChanged(new MatSelectChange(this.source, major));
            const courseGroupMembers = this.groupToEdit.members;

            for (let member of courseGroupMembers) {
              this.groupMembersEmails.push(member.email);
              // console.log(this.emails);
            }
            this.groupForm = this.formBuilder.group({
              groupType: [this.groupToEdit.type],
              title: [this.groupToEdit.name],
              description: [this.groupToEdit.description],
              semesterTerm: [this.groupToEdit.semesterTerm],
              semesterYear: [this.groupToEdit.semesterYear],
              majorControl: [this.groupToEdit.major.name]
            });
          }
        });
    }
  }
  deleteEmail(index: number) {
    this.customGroupEmails.splice(index, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.groupMembersEmails.includes(event.option.value)) {
      this.groupMembersEmails.push(event.option.value);
      this.userInput.nativeElement.value = "";
      this.email.setValue(null);
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add emails
      if (value.trim()) {
        // this.emails.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }
      this.email.setValue(null);
    }
    // const input = event.input;
    // this.email.setValue(event.value);
    // console.log(this.email.hasError("email"));
    // if (!this.email.hasError("email")) {
    //   if (this.email.value.trim()) {
    //     this.isEmailValid = true;
    //     this.groupMembersEmails.push(this.email.value.trim());
    //     this.customGroupEmails.push(this.email.value.trim());
    //     console.log(this.groupMembersEmails);
    //   } else if (
    //     this.email.value === "" &&
    //     this.groupMembersEmails.length <= 0
    //   ) {
    //     this.chipList.errorState = true;
    //     this.isEmailValid = false;
    //     this.errorMessage = "please enter a valid email address";
    //   } else {
    //     this.chipList.errorState = false;
    //   }
    // } else {
    //   this.chipList.errorState = true;
    //   this.isEmailValid = false;
    //   this.errorMessage = "please enter a valid email address";
    // }

    // // Reset the input value
    // if (input) {
    //   input.value = "";
    // }
  }

  remove(email: string): void {
    const index = this.groupMembersEmails.indexOf(email);
    if (index >= 0) {
      this.groupMembersEmails.splice(index, 1);
    }
  }

  cancel() {
    this.router.navigate(["/home/group/your-group"]);
  }

  onMajorChanged(event: any) {
    const majorSelected = event.value;
    const currentMajorObj = this.allMajors.find(
      obj => obj.name === majorSelected
    );
    const majorId = currentMajorObj.id;
    this.groupDataStorageService.getCourseDetails(majorId).subscribe(result => {
      if (result.status == 200) {
        this.courseDetails = result.result.courses;
      }
    });
  }

  onTitleChanged(event: any) {
    this.selectedTitle = event.value;
    this.selectedCourseGroupDetail = this.courseDetails.find(
      i => i.title === this.selectedTitle
    );
    this.groupForm
      .get("description")
      .setValue(this.selectedCourseGroupDetail.description);
  }

  upload(event: any) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles.length);
    this.isInvalid = false;
    if (!this.validateFile(this.selectedFiles[0].name)) {
      this.isInvalid = true;
      this.invalidExtension = "file type not supported. upload .xlsx file!  ";
    }
  }
  onSubmit() {
    const groupFormValues = this.groupForm.value;
    if (this.editMode) {
      const obj = {
        name: groupFormValues.title,
        description: groupFormValues.description,
        recipients: this.groupMembersEmails,
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
            this.router.navigate(["/home/group/your-group"]);
          }
        });
    } else {
      if (this.groupMembersEmails.length > 0) {
        const obj = {
          name: groupFormValues.title,
          description: groupFormValues.description,
          recipients: this.groupMembersEmails,
          type: groupFormValues.groupType,
          semesterTerm: groupFormValues.semesterTerm,
          semesterYear: groupFormValues.semesterYear,
          major: groupFormValues.majorControl
        };

        this.groupDataStorageService.createGroup(obj).subscribe(result => {
          if (result) {
            console.log(result);
            if (result.result) {
              this._snackBar.open(result.message, "close", {
                duration: 5000,
                panelClass: ["standard"]
              });
            } else {
              this._snackBar.open(result.message, "close", {
                duration: 5000,
                panelClass: ["delete"]
              });
            }

            this.groupDataStorageService.fetchGroup();
            this.router.navigate(["/home/group/your-group"]);
          }
        });
      } else if (this.selectedFiles.length == 1) {
        const objUser = {
          name: groupFormValues.title,
          description: groupFormValues.description,
          type: groupFormValues.groupType,
          semesterTerm: groupFormValues.semesterTerm,
          semesterYear: groupFormValues.semesterYear,
          major: groupFormValues.majorControl
        };

        console.log(objUser);
        this.currentFileUpload = this.selectedFiles.item(0);
        console.log(this.currentFileUpload);
        const formData = new FormData();
        formData.append("user", JSON.stringify(objUser));
        formData.append("file", this.currentFileUpload);
        this.groupDataStorageService
          .createGroupWithFile(formData)
          .subscribe(result => {
            if (result) {
              console.log(result);
              if (result.result) {
                this._snackBar.open(result.message, "close", {
                  duration: 4000,
                  panelClass: ["standard"]
                });
                this.groupDataStorageService.fetchGroup();
                this.router.navigate(["/home/group/your-group"]);
              } else {
                this._snackBar.open(result.message, "close", {
                  duration: 4000,
                  panelClass: ["delete"]
                });
              }
            }
          });
      }
    }
  }

  validateFile(name: String) {
    var fileExt = name.substring(name.lastIndexOf(".") + 1);
    console.log("Input files extension: " + fileExt);
    for (let ext of this.validFileExtensions) {
      if (fileExt.toLowerCase() == ext) {
        return true;
      }
    }
    return false;
  }
}
