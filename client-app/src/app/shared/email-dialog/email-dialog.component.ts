import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { DialogShareGroup } from "src/app/home/group/group-detail/group-detail.component";
import { MatChipInputEvent } from "@angular/material/chips";
import { Validators, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DataStorageService } from "src/app/home/shared/data-storage.service";

@Component({
  selector: "app-email-dialog",
  templateUrl: "./email-dialog.component.html",
  styleUrls: ["./email-dialog.component.css"]
})
export class EmailDialogComponent implements OnInit {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  constructor(
    private router: Router,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit() {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
  onSubmit() {
    // console.log(this.emailFormControl.value);
    this.dataStorageService
      .resetPassword(this.emailFormControl.value)
      .subscribe(r => console.log(r));
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  // saveDialogData() {
  //   this.dialogRef.close(this.emailFormControl.value);
  //   console.log(this.emailFormControl.value);
  // }
}
