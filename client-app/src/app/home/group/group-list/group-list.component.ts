import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Group } from "../models-group/group";
import { GroupDataStorageService } from "../group-data-storage.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.css"]
})
export class GroupListComponent implements OnInit {
  group: Group[] = [];
  currentRole: string;
  searchText = "";
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService,
    private role: AuthService
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    if (this.currentRole === "ROLE_ADMIN") {
      this.groupDataStorage.fetchGroup();
      this.groupDataStorage.isLoading.subscribe(loading => {
        if (!loading) {
          this.group = this.groupDataStorage.groupLists;
        }
      });
    }
    // this.group = this.groupDataStorage.getGroups();
  }
  // create() {
  //   this.router.navigate(["home/group/create-group"]);
  // }
}
