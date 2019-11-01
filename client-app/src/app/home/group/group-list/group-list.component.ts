import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.css"]
})
export class GroupListComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  create() {
    this.router.navigate(["home/group/create-group"]);
  }
}
