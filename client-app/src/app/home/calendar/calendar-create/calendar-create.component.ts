import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatChipInputEvent, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { GroupSelection } from '../../shared/group-selection';

@Component({
  selector: 'app-calendar-create',
  templateUrl: './calendar-create.component.html',
  styleUrls: ['./calendar-create.component.css']
})
export class CalendarCreateComponent implements OnInit {
  calForm: FormGroup;
  emails: string[];
  color: string = '#5484ed';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private ref: MatDialogRef<CalendarCreateComponent>,
    private dataStorage: DataStorageService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.emails=[];
    this.calForm = new FormGroup({
      name: new FormControl(),
      recipients: new FormControl(),
      color: new FormControl()
    })
  }

  close(){
    this.ref.close();
  }

  setPrimary(color: string){
    this.color = color;
  }

  onSubmit(){
    const obj = {
      name: this.calForm.value['name'],
      recipients: this.emails,
      color: this.color
    }
    this.dataStorage.newCalendar(obj).subscribe(result => {
      console.log(obj);
      if (result) {
        this.dataStorage.fetchCalendars();
      }
    });
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
