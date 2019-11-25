import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Group } from "../models-group/group";
import { GroupDataStorageService } from "../group-data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { GroupCreateNavigationService } from "../group/group-create-navigation.service";

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
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService,
    private role: AuthService,
    private route: ActivatedRoute,
    private groupTypeNavigation: GroupCreateNavigationService
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    if (this.currentRole === "ROLE_ADMIN") {
      this.groupDataStorage.fetchGroup();
      this.groupDataStorage.isLoading.subscribe(loading => {
        if (!loading) {
          this.group = this.groupDataStorage.groupLists;
          console.log(this.group);
          if (this.group.length <= 0) {
            this.isGroupEmpty = true;
          }
        }
      });
    }
  }
  // createCourseGroup() {
  //   this.router.navigate(["create-group"], { relativeTo: this.route });
  //   this.groupTypeNavigation.changeGroupType("course");
  // }

  // createCustomGroup() {
  //   this.router.navigate(["home/group/create-group"]);
  //   this.groupTypeNavigation.changeGroupType("custom");
  // }
}
