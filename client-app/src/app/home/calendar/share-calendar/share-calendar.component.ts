import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatDialog } from '@angular/material';
import { Calendar } from '../calendar-list/calendar.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { GroupSelection } from '../../shared/group-selection';

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
  errorMessage: string;
  isEmailValid = true;

  constructor(
    private ref: MatDialogRef<ShareCalendarComponent>,
    private dataStorage: DataStorageService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)public data: any
  ) { }

  ngOnInit() {
    this.emails = [];
    console.log(this.data);
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

  groupSelect(){
    const dialogRef = this.dialog.open(GroupSelection, {
      width: "500px"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      for(let email of result){
        if(!this.emails.includes(email)){
          this.emails.push(email);
        }
      }
    })
  }

}
