import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatChipInputEvent, MatDialog, MatSnackBar, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService, Emails } from '../../shared/data-storage.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { GroupSelection } from '../../shared/group-selection';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-create',
  templateUrl: './calendar-create.component.html',
  styleUrls: ['./calendar-create.component.css']
})
export class CalendarCreateComponent implements OnInit {
  calForm: FormGroup;
  emails: string[];
  color: string = '#5484ed';
  role:string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  email = new FormControl("",[Validators.email]);
  isEmailValid: boolean;
  @ViewChild("chipList", { static: false }) chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  errorMessage: string;
  filteredUserList: Observable<string[]>;
  userList: string[] = [];
  @ViewChild("userInput", { static: false }) userInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private ref: MatDialogRef<CalendarCreateComponent>,
    private dataStorage: DataStorageService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.dataStorage.getEmails();
    this.dataStorage.emails.subscribe((result: Emails[]) => {
      if (result.length > 0) {
        result.forEach(o => this.userList.push(o.email));
      }
    });

    this.filteredUserList = this.email.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.userList.slice()
      )
    );
   }

  filter(value: string): string[] {
    const filterValue = value.toLocaleLowerCase();
    return this.userList.filter(user =>
      user.toLocaleLowerCase().includes(filterValue)
    );
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.emails.includes(event.option.value)) {
      this.emails.push(event.option.value);
      this.userInput.nativeElement.value = "";
      this.email.setValue(null);
    }
  }

  ngOnInit() {
    this.role = this.authService.user;
    this.emails=[];
    this.calForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      email: this.email,
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
      if (result) {
        this.snackbar.open(result.message,'' ,{duration: 5000})
        if(result.status === 201){
          this.dataStorage.fetchCalendars();
          this.ref.close();
        }
        
      }
    });
    
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
