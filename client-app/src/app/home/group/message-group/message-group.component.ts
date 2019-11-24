import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Group } from "../models-group/group";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-message-group",
  templateUrl: "./message-group.component.html",
  styleUrls: ["./message-group.component.css"]
})
export class MessageGroupComponent implements OnInit {
  id: number;
  messageForm: FormGroup;

  constructor(
    private ref: MatDialogRef<MessageGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group
  ) {}

  ngOnInit() {
    if (this.isEmpty(this.data)) {
      console.log("empty");
    } else {
      this.id = this.data.id;
      console.log(this.id);
    }

    console.log(this.data);
    this.messageForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      message: new FormControl("", [Validators.required])
    });
  }

  isEmpty(obj: Object) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
  onSubmit() {
    if (this.isEmpty(this.data)) {
      const selectedMemberObj = {
        title: this.messageForm.value["title"],
        message: this.messageForm.value["message"]
      };
      console.log(selectedMemberObj);
      this.ref.close(selectedMemberObj);
    } else {
      const groupEmailObj = {
        id: this.id,
        title: this.messageForm.value["title"],
        message: this.messageForm.value["message"]
      };
      console.log(groupEmailObj);
      this.ref.close(groupEmailObj);
    }
  }

  cancel() {
    this.ref.close();
  }
}
