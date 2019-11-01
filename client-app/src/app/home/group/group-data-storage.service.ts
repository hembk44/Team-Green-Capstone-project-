import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { GroupModel } from "./models-group/group-model";

@Injectable({
  providedIn: "root"
})
export class GroupDataStorageService {
  groupChanged = new Subject<GroupModel[]>();
  constructor() {}

  private group: GroupModel[] = [
    new GroupModel(1, "CSCI 4060", "Software Engineering of Fall 2019", [
      "bkhb@warhawks.ulm.edu",
      "borenbl@warhawks.ulm.edu",
      "byanjay@warhawks.ulm.edu",
      "dahala1@warhawks.ulm.edu",
      "fontannr@warhawks.ulm.edu",
      "guptaa@warhawks.ulm.edu",
      "jangs@warhawks.ulm.edu",
      "karkin2@warhawks.ulm.edu",
      "khadkal@warhawks.ulm.edu",
      "laura@warhawks.ulm.edu",
      "lemonsdm@warhawks.ulm.edu",
      "maharjr@warhawks.ulm.edu",
      "moorea1@warhawks.ulm.edu",
      "pearsolp@warhawks.ulm.edu",
      "peterses@warhawks.ulm.edu",
      "rayc@warhawks.ulm.edu",
      "sangras@warhawks.ulm.edu",
      "shrests3@warhawks.ulm.edu",
      "vogtap@warhawks.ulm.edu"
    ]),
    new GroupModel(2, "ACM", "Students in ACM ULM", [
      "hem@warhawks.ulm.edu",
      "baral@gmail.com"
    ]),
    new GroupModel(3, "Nepali Students", "Nepalese CS students", [
      "nitesh@warhawks.ulm.edu",
      "rohan@gmail.com"
    ])
  ];

  getGroups() {
    return this.group.slice();
  }

  getGroup(index: number) {
    return this.group[index];
  }
}
