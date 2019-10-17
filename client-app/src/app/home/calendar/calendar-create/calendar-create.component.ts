import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-calendar-create',
  templateUrl: './calendar-create.component.html',
  styleUrls: ['./calendar-create.component.css']
})
export class CalendarCreateComponent implements OnInit {
  calForm: FormGroup;

  constructor(
    private ref: MatDialogRef<CalendarCreateComponent>,
    private dataStorage: DataStorageService
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
      recipients: [this.calForm.value['recipients']]
    }
    this.dataStorage.newCalendar(obj).subscribe(result => {
      console.log(obj);
      if (result) {
        this.dataStorage.fetchCalendars();
      }
    });
    this.ref.close();
  }

}
