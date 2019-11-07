import { Component, OnInit } from "@angular/core";
import { Group } from "../models-group/group";
import { GroupDataStorageService } from "../group-data-storage.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.css"]
})
export class GroupDetailComponent implements OnInit {
  group: any;
  id: number;
  groupName: string;
  groupDesc: string;
  groupemails: string[];
  numOfmembers: number;
  searchText = "";
  currentRole: string;
  constructor(
    private groupDataStorage: GroupDataStorageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
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
          console.log(this.groupemails);
        });
      }
      // this.group = this.groupDataStorage.getGroup(this.id);
      // this.groupName = this.group.name;
      // this.groupDesc = this.group.description;
      // this.groupemails = this.group.recepients;
      // this.numOfmembers = this.group.recepients.length;
    });
  }
}
