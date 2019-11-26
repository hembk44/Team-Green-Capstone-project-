import { MatDialogRef, MatDialog } from "@angular/material";
import { Component, OnInit } from "@angular/core";
import { GroupDataStorageService } from "../group/group-data-storage.service";

@Component({
  selector: "group-selection",
  templateUrl: "group-selection.html",
  styleUrls: ["./group-selection.css"]
})
export class GroupSelection implements OnInit {
  groups: any[];
  ids: number[];
  members: string[];
  searchText = "";
  tempGroups: any[];
  constructor(
    private ref: MatDialogRef<GroupSelection>,
    private dialog: MatDialog,
    private groupDataStorage: GroupDataStorageService
  ) {}

  ngOnInit() {
    this.groups = [];
    this.tempGroups = [];
    this.ids = [];
    this.members = [];
    this.groupDataStorage.fetchGroup();
    this.groupDataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.groups = this.groupDataStorage.groupLists;
      }
    });
    console.log(this.groups);
  }

  close() {
    
    this.ref.close(this.tempGroups);
  }

  addGroup(id: number) {
    // if (!this.ids.includes(id)) {
    //   this.ids.push(id);
    // } else {
    //   this.ids.splice(this.ids.indexOf(id), 1);
    // }
    console.log(id);
    this.groupDataStorage.displayGroupDetails(id).subscribe(result=> {
      const obj = {
        id: id,
        emails: result.result.members
      }
      console.log(obj);
      if(!this.ids.includes(obj.id)){
        this.ids.push(obj.id);
        this.tempGroups.push(obj)
      } else {
        this.ids.splice(this.ids.indexOf(id),1)
        this.tempGroups.splice(this.ids.indexOf(id),1);
      }
      console.log(this.tempGroups);
    });

    // for (let id of this.ids) {
    //   this.groupDataStorage.displayGroupDetails(id).subscribe(result => {
    //     console.log(result.result.members);
    //     for (let member of result.result.members) {
    //       this.members.push(member.email);
    //     }
    //   });
    //   console.log(this.members);
    // }
  }
}
