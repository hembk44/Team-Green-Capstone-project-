import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { Calendar } from '../calendar-list/calendar.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-share-calendar',
  templateUrl: './share-calendar.component.html',
  styleUrls: ['./share-calendar.component.css']
})
export class ShareCalendarComponent implements OnInit {
  shareForm: FormGroup;
  emails: string[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  constructor(
    private ref: MatDialogRef<ShareCalendarComponent>,
    private dataStorage: DataStorageService,
    @Inject(MAT_DIALOG_DATA)public data: Calendar
  ) { }

  ngOnInit() {
    this.emails = this.data.recipients;
    if(!this.emails){
      this.emails = [];
    }
    this.shareForm = new FormGroup({
      recipients: new FormControl()
    })
  }

  onSubmit(){
    const obj = {
      calendarId: this.data.id,
      recipients: this.emails
    }
    this.dataStorage.shareCalenar(obj).subscribe(result=>{
      console.log(result);
    });
    this.dataStorage.isLoading.subscribe(result =>{
      console.log(obj);
      if(result){
        console.log('done');
      }
    });
    this.ref.close();
  }

  close(){
    this.ref.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add emails
    if (value.trim()) {
      this.emails.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

}
