import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from '../calendar.model';
import { CalendarService } from '../calendar.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css']
})
export class CalendarItemComponent implements OnInit {
  @Input()index: number;//index of calendar in list
  @Input()calendar: Calendar;//calendar object to show
  checked = true;
  username;

  constructor(private calService: CalendarService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.username = this.authService.username;
  }
  
  toggleCal(){
    this.calService.toggleCalendar(this.calendar);
  }

  deleteCal(){
    this.dialog.open(DeleteConfirm, {
      width: "500px"
    })
  }

  renameCal(){
    this.dialog.open(CalRename, {
      width:"500px"
    })
  }

}

@Component({
  selector: 'app-cal-rename',
  templateUrl: 'cal-rename.html',
  styleUrls: ['calendar-item.component.css']
})
export class CalRename implements OnInit{
  nameForm: FormGroup;
  constructor (
    private ref: MatDialogRef<CalRename>
  ){}
  ngOnInit(){
    this.nameForm = new FormGroup({
      name: new FormControl()
    })
  }
  onSubmit(){
    const obj = {
      name: this.nameForm.value['name']
    }
    console.log(obj);
  }

  close(){
    this.ref.close();
  }
}

@Component({
  selector: 'app-delete-confirm',
  templateUrl: 'delete-confirm.html',
  styleUrls: ['calendar-item.component.css']
})
export class DeleteConfirm{

  constructor(
    private ref: MatDialogRef<DeleteConfirm>
  ){}

  close(){
    this.ref.close();
  }

}

