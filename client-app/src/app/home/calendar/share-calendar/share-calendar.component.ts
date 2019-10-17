import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Calendar } from '../calendar-list/calendar.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-share-calendar',
  templateUrl: './share-calendar.component.html',
  styleUrls: ['./share-calendar.component.css']
})
export class ShareCalendarComponent implements OnInit {
  shareForm: FormGroup;

  constructor(
    private ref: MatDialogRef<ShareCalendarComponent>,
    private dataStorage: DataStorageService,
    @Inject(MAT_DIALOG_DATA)public data: Calendar
  ) { }

  ngOnInit() {
    this.shareForm = new FormGroup({
      recipients: new FormControl()
    })
  }

  onSubmit(){
    const obj = {
      calendarId: this.data.id,
      recipients: this.shareForm.value['recipients'].split(',')
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

}
