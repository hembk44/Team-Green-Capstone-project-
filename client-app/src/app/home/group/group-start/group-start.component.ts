import { Component, OnInit } from "@angular/core";
import { GroupDataStorageService } from "../group-data-storage.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-group-start",
  templateUrl: "./group-start.component.html",
  styleUrls: ["./group-start.component.css"]
})
export class GroupStartComponent implements OnInit {
  isGroupEmpty: boolean = false;
  constructor(
    private groupDataStorage: GroupDataStorageService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.groupDataStorage.fetchGroup();
    console.log(this.groupDataStorage.groupLists);
    this.groupDataStorage.isLoading.subscribe(loading => {
      console.log(loading);
      if (!loading) {
        if (this.groupDataStorage.groupLists.length > 0) {
          this.isGroupEmpty = true;
        } else {
          this.isGroupEmpty = false;
        }
      }
    });
  }
}
