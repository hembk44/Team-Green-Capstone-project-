import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from "@angular/material";
import { DataStorageService } from "../../shared/data-storage.service";

@Component({
  selector: "app-delete-users",
  templateUrl: "./delete-users.component.html",
  styleUrls: [
    "./delete-users.component.css",
    "../register-users/register-users.component.css"
  ]
})
export class DeleteUsersComponent implements OnInit {
  private updates: any[];
  private updateEmails: string[];
  searchText = "";

  users = [];

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

  addUser(name: string, email: string) {
    if (this.updateEmails.includes(email)) {
      this.updateEmails.splice(this.updateEmails.indexOf(email), 1);
      this.updates.splice(this.updateEmails.indexOf(email), 1);
    } else {
      this.updates.push({
        name: name,
        email: email
      });
      this.updateEmails.push(email);
    }

    console.log(this.updateEmails);
    console.log(this.updates);
  }

  onSubmit() {
    if (this.updateEmails.length === 0) {
      alert("Please make at least one selection first.");
    } else {
      const dialogRef = this.dialog.open(DeleteUsers, {
        width: "650px",
        height: "400px",
        data: this.updates
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "confirmed") {

          this.dataStorage.deleteUsers(this.updateEmails).subscribe(result => {
            console.log(result);
            if(result){
              this.snackbar.open(result.message, 'OK', {duration: 5000});
              this.dataStorage.fetchUsers();
            }
          });
          
          this.updates = [];
          this.updateEmails = [];
        }
      });
    }
  }
}

@Component({
  selector: "user-delete",
  templateUrl: "user-delete-confirm.html",
  styleUrls: [
    "user-delete-confirm.css",
    "delete-users.component.css",
    "../register-users/register-users.component.css",
    "../update-roles/role-confirm.css"
  ]
})
export class DeleteUsers {
  constructor(
    private dialog: MatDialogRef<DeleteUsers>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  close() {
    this.dialog.close("cancel");
  }

  confirm() {
    console.log(this.data);
    this.dialog.close("confirmed");
  }
}
