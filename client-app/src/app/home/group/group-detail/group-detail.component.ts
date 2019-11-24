import { Component, OnInit } from "@angular/core";
import { Group } from "../models-group/group";
import { GroupDataStorageService } from "../group-data-storage.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { Validators, FormControl } from "@angular/forms";
import { GroupCreateNavigationService } from "../group/group-create-navigation.service";
import { share } from "rxjs/operators";
import { MessageGroupComponent } from "../message-group/message-group.component";
import { MatListOption } from "@angular/material/list";
import { GroupSnackbarComponent } from "../shared-group/group-snackbar/group-snackbar.component";
import { DataStorageService } from "../../shared/data-storage.service";

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.css"]
})
export class GroupDetailComponent implements OnInit {
  group: any;
  id: number;
  editMode: boolean = false;
  groupName: string;
  groupDesc: string;
  groupemails: string[];
  groupSharedEmails: string[];
  numOfmembers: number;
  searchText = "";
  currentRole: string;
  groupType: string;
  selectedGroupMembers: string[] = [];

  constructor(
    private groupDataStorage: GroupDataStorageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dataStorage: DataStorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];

      this.currentRole = this.authService.user;

      if (this.currentRole === "ROLE_ADMIN") {
        console.log("admin data here!");
        this.groupDataStorage.displayGroupDetails(this.id).subscribe(result => {
          this.group = result.result;
          console.log(result);
          this.groupName = this.group.name;
          this.groupDesc = this.group.description;
          this.numOfmembers = this.group.members.length;
          this.groupemails = this.group.members;
          this.groupType = this.group.type.toLowerCase();
          console.log(this.groupType);
        });
      }
    });
  }

  onSelectChange(options: MatListOption[]) {
    console.log(options.map(o => o.value));
    this.selectedGroupMembers = options.map(o => o.value);
    console.log(this.selectedGroupMembers);
  }

  shareGroup(): void {
    console.log("shrae dialog");
    const dialogRef = this.dialog.open(DialogShareGroup, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.groupSharedEmails = result;
      const shareObj = {
        id: this.id,
        emails: this.groupSharedEmails
      };
      console.log(shareObj);
      this.groupDataStorage.shareGroup(shareObj).subscribe(result => {
        console.log(result);
        const sharedMsg = " This group has been successfully shared!";
        if (result.status == 200) {
          this._snackBar.openFromComponent(GroupSnackbarComponent, {
            duration: 4000,
            panelClass: ["standard"],
            data: sharedMsg
          });
        }
      });
    });
  }

  deleteGroup(id: number) {
    console.log("deleted");
    this.groupDataStorage.deleteGroup(id).subscribe(result => {
      console.log(result);

      if (result.status == 200) {
        const deletedMsg =
          result.result.name + "group has been successfully deleted!";
        this._snackBar.openFromComponent(GroupSnackbarComponent, {
          duration: 4000,
          panelClass: ["delete"],
          data: deletedMsg
        });
      } else if (result.status == 403) {
        this._snackBar.openFromComponent(GroupSnackbarComponent, {
          duration: 4000,
          panelClass: ["delete"],
          data: result.message
        });
      }
      this.groupDataStorage.fetchGroup();
    });
    this.router.navigate(["/home/group"]);
  }

  editGroup() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  emailSelectedMembers() {
    const dialogRef = this.dialog.open(MessageGroupComponent, {
      width: "400px",
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      result.recipients = this.selectedGroupMembers;
      console.log(result);
      if (result) {
        this.dataStorage.emailSelectedMembers(result).subscribe(result => {
          console.log(result);
          if (result.status === 200) {
            this._snackBar.openFromComponent(GroupSnackbarComponent, {
              duration: 5000,
              panelClass: ["standard"],
              data: "An email has been successfully to selected members!"
            });
          }
        });
      }
    });
  }

  messageGroup() {
    const dialogRef = this.dialog.open(MessageGroupComponent, {
      width: "400px",
      data: {
        id: this.id,
        name: this.group.name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.groupDataStorage.sendEmail(result).subscribe(result => {
          if (result.status === 200) {
            this._snackBar.openFromComponent(GroupSnackbarComponent, {
              duration: 5000,
              panelClass: ["standard"],
              data: "An email has been successfully to " + this.group.name + "!"
            });
          }
        });
      }
    });
  }
}

@Component({
  selector: "dialog-share-group",
  templateUrl: "share-group-dialog.html",
  styleUrls: ["./group-detail.component.css"]
})
export class DialogShareGroup implements OnInit {
  // email = new FormControl("", [Validators.required, Validators.email]);
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogShareGroup>,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

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

  // getErrorMessage() {
  //   return this.email.hasError("required")
  //     ? "You must enter a value"
  //     : this.email.hasError("email")
  //     ? "Not a valid email"
  //     : "";
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialogData() {
    console.log("Email Array: " + this.emails);
    this.dialogRef.close(this.emails);
  }
}
