import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GroupDataStorageService } from "../group-data-storage.service";

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrls: ["./group.component.css"]
})
export class GroupComponent implements OnInit {
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService
  ) {}

  ngOnInit() {}
  create() {
    this.router.navigate(["home/group/create-group"]);
  }
}
