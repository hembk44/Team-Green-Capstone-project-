import { Component, OnInit } from "@angular/core";
import { GroupModel } from "../models-group/group-model";
import { GroupDataStorageService } from "../group-data-storage.service";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.css"]
})
export class GroupDetailComponent implements OnInit {
  group: GroupModel;
  id: number;
  groupName: string;
  groupDesc: string;
  groupemails: string[];
  numOfmembers: number;
  searchText = "";
  constructor(
    private groupDataStorage: GroupDataStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.group = this.groupDataStorage.getGroup(this.id);
      this.groupName = this.group.name;
      this.groupDesc = this.group.description;
      this.groupemails = this.group.recepients;
      this.numOfmembers = this.group.recepients.length;
    });
  }
}
