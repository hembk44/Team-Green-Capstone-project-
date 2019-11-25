import { Component, OnInit, Input } from "@angular/core";
import { Group } from "../models-group/group";
import { Router } from "@angular/router";
import { GroupDataStorageService } from "../group-data-storage.service";

@Component({
  selector: "app-group-item",
  templateUrl: "./group-item.component.html",
  styleUrls: ["./group-item.component.css"]
})
export class GroupItemComponent implements OnInit {
  @Input() eachGroup: Group;
  @Input() id: number;
  @Input() semester: string;
  @Input() semesterYear: number;
  constructor(
    private router: Router,
    private groupDataStorage: GroupDataStorageService
  ) {}

  ngOnInit() {}
  showDetails(id: number) {
    this.router.navigate(["home/group/your-group", id]);
  }
}
