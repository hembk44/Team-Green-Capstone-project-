import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GroupDataStorageService } from "../group-data-storage.service";
import { GroupCreateNavigationService } from "./group-create-navigation.service";

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrls: ["./group.component.css"]
})
export class GroupComponent implements OnInit {
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService,
    private groupTypeNavigation: GroupCreateNavigationService
  ) {}

  ngOnInit() {}
  createCourseGroup() {
    this.router.navigate(["home/group/create-group"]);
    this.groupTypeNavigation.changeGroupType("course");
  }

  createCustomGroup() {
    this.router.navigate(["home/group/create-group"]);
    this.groupTypeNavigation.changeGroupType("custom");
  }
}
