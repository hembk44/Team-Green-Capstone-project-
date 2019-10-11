import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar-create',
  templateUrl: './calendar-create.component.html',
  styleUrls: ['./calendar-create.component.css']
})
export class CalendarCreateComponent implements OnInit {
  calForm: FormGroup;

  constructor(
    private ref: MatDialogRef<CalendarCreateComponent>
  ) { }

  ngOnInit() {
    this.calForm = new FormGroup({
      name: new FormControl(),
      recipients: new FormControl()
    })
  }

  close(){
    this.ref.close();
  }

  onSubmit(){
    const obj = {
      name: this.calForm.value['name'],
      recipients: this.calForm.value['recipients']
    }
    console.log(obj);
  }

}
