import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Group } from "../models-group/group";
import { GroupDataStorageService } from "../group-data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { GroupCreateNavigationService } from "../group/group-create-navigation.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.css"]
})
export class GroupListComponent implements OnInit {
  group: Group[] = [];
  currentRole: string;
  isGroupEmpty: boolean = false;
  searchText = "";
  groupExists: boolean = false;
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService,
    private role: AuthService,
    private route: ActivatedRoute,
    private groupTypeNavigation: GroupCreateNavigationService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    this.groupDataStorage.fetchGroup();
    console.log(this.groupDataStorage.groupLists);
    this.groupDataStorage.isLoading.subscribe(loading => {
      console.log(loading);
      if (!loading) {
        if (this.groupDataStorage.groupLists.length > 0) {
          this.group = this.groupDataStorage.groupLists;
        } else {
          this.isGroupEmpty = true;
        }
      }
    });
  }
}
