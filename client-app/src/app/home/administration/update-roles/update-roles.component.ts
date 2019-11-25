import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatSnackBar
} from "@angular/material";
import { DataStorageService } from "../../shared/data-storage.service";

@Component({
  selector: "app-update-roles",
  templateUrl: "./update-roles.component.html",
  styleUrls: [
    "./update-roles.component.css",
    "../register-users/register-users.component.css"
  ]
})
export class UpdateRolesComponent implements OnInit {
  updates: any[];
  updateEmails: string[];
  users = [];
  searchText = "";

  constructor(
    private dialog: MatDialog,
    private dataStorage: DataStorageService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.updates = [];
    this.updateEmails = [];
    this.dataStorage.fetchUsers();
    this.dataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.users = this.dataStorage.users;
        console.log(this.users);
      }
    });

    this.users.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : 0
    );
  }

  addUser(name: string, email: string, role: string) {
    if (this.updateEmails.includes(email)) {
      this.updates.splice(this.updateEmails.indexOf(email), 1);
      this.updates.push({
        name: name,
        email: email,
        roles: role
      });
    } else {
      this.updates.push({
        name: name,
        email: email,
        roles: role
      });
      this.updateEmails.push(email);
    }

    console.log(this.updateEmails);
    console.log(this.updates);
  }

  onSubmit() {
    console.log(this.updateEmails.length);
    if (this.updateEmails.length !== 0) {
      const dialogRef = this.dialog.open(RoleConfirm, {
        width: "650px",
        height: "400px",
        data: this.updates
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === "confirmed") {
          this.dataStorage.updateRoles(this.updates).subscribe(result => {
            if(result){
              this.snackbar.open(result.message, '', {duration:3000});
              this.dataStorage.fetchUsers();
            }      
          });
          this.updateEmails = [];
          this.updates = [];
          console.log('fetched');
        }
      });
    } else {
      alert("Please make some changes first");
    }
  }
}

@Component({
  selector: "role-confirm-dialog",
  templateUrl: "role-confirm.html",
  styleUrls: [
    "role-confirm.css",
    "update-roles.component.css",
    "../register-users/register-users.component.css"
  ]
})
export class RoleConfirm {
  constructor(
    private dialog: MatDialogRef<RoleConfirm>,
    @Inject(MAT_DIALOG_DATA) private data: any[]
  ) {}

  confirm() {
    console.log(this.data);
    this.dialog.close("confirmed");
  }

  cancel() {
    this.dialog.close("cancel");
  }
}
