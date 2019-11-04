import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GroupModel } from "../models-group/group-model";
import { GroupDataStorageService } from "../group-data-storage.service";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.css"]
})
export class GroupListComponent implements OnInit {
  group: GroupModel[];
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService
  ) {}

  ngOnInit() {
    this.group = this.groupDataStorage.getGroups();
  }
  // create() {
  //   this.router.navigate(["home/group/create-group"]);
  // }
}
