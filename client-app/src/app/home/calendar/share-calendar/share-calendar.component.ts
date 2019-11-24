import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatSnackBar } from '@angular/material';
import { Calendar } from '../calendar-list/calendar.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from '../../shared/data-storage.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { GroupSelection } from '../../shared/group-selection';
import { AuthService } from 'src/app/auth/auth.service';

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
  email = new FormControl("",[Validators.email]);
  isEmailValid: boolean;
  @ViewChild("chipList", { static: false }) chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  errorMessage: string;m
  role: string;

  constructor(
    private ref: MatDialogRef<ShareCalendarComponent>,
    private dataStorage: DataStorageService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)public data: any
  ) { }

  ngOnInit() {
    this.role = this.authService.user;
    this.emails = [];
    console.log(this.data);
    this.shareForm = new FormGroup({
      email: new FormControl('',[Validators.email])
    })
  }

  onSubmit(){
    const obj = {
      calendarId: this.data.id,
      recipients: this.emails
    }
    this.dataStorage.shareCalenar(obj).subscribe(result=>{
      console.log(result);
      this.snackbar.open(result.message, '', {duration:5000})
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
    // const value = event.value;
    this.email.setValue(event.value);
    console.log(this.email.hasError("email"));
    if (!this.email.hasError("email")) {
      // if (!this.email.hasError("email")) {
      if (this.email.value.trim()) {
        this.isEmailValid = true;
        this.emails.push(this.email.value.trim());
        this.emails.sort((a, b) =>
          a.toLowerCase() < b.toLowerCase()
            ? -1
            : a.toLowerCase() > b.toLowerCase()
            ? 1
            : 0
        );
        console.log(this.emails);
      } else if (this.email.value === "" && this.emails.length < 0) {
        this.chipList.errorState = true;
        this.isEmailValid = false;
        this.errorMessage = "please enter a valid email address";
      } else {
        this.chipList.errorState = false;
      }
    } else {
      this.chipList.errorState = true;
      this.isEmailValid = false;
      this.errorMessage = "please enter a valid email address";
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
