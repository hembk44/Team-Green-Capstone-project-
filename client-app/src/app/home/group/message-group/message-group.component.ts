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
    this.id = this.data.id;
    console.log(this.data);
    this.messageForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      message: new FormControl("", [Validators.required])
    });
  }

  onSubmit() {
    const obj = {
      id: this.id,
      title: this.messageForm.value["title"],
      message: this.messageForm.value["message"]
    };
    console.log(obj);
    this.ref.close(obj);
  }

  cancel() {
    this.ref.close();
  }
}
