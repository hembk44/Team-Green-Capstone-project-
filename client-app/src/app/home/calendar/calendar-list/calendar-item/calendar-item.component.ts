import { Component, OnInit, Input, Inject } from '@angular/core';
import { Calendar } from '../calendar.model';
import { CalendarService } from '../calendar.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ShareCalendarComponent } from '../../share-calendar/share-calendar.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DataStorageService } from 'src/app/home/shared/data-storage.service';

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
    private dataStorage: DataStorageService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.calendar);
    this.username = this.authService.name;
  }
  
  toggleCal(){
    this.calService.toggleCalendar(this.calendar);
  }

  deleteCal(){
    const dialogRef = this.dialog.open(DeleteConfirm, {
      width: "250px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'confirmed'){
        this.dataStorage.deleteCalendar(this.calendar.id);
      }
    })
  }

  renameCal(){
    this.dialog.open(CalRename, {
      width:"500px",
      data: this.calendar
    })
  }

  shareCal(){
    this.dialog.open(ShareCalendarComponent, {
      width: "500px",
      data: this.calendar
    });
  }

}

@Component({
  selector: 'app-cal-rename',
  templateUrl: 'cal-rename.html',
  styleUrls: ['calendar-item.component.css']
})
export class CalRename implements OnInit{
  nameForm: FormGroup;
  cal: Calendar;
  primaryColor: string;
  constructor (
    private ref: MatDialogRef<CalRename>,
    private dataStorage: DataStorageService,
    @Inject(MAT_DIALOG_DATA)public data: Calendar
  ){}
  ngOnInit(){
    this.cal = this.data;
    console.log(this.cal);
    this.primaryColor = this.cal.color;
    this.nameForm = new FormGroup({
      name: new FormControl(this.cal.name),
      color: new FormControl()
    })
  }
  onSubmit(){
    const nameFormValues = this.nameForm.value;
    const obj = {
      name: nameFormValues.name,
      color: this.primaryColor
    }
    this.dataStorage.updateCalendar(obj);
  }

  setPrimary(color: string){
    this.primaryColor = color;
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
    this.ref.close('cancel');
  }

  delete(){
    this.ref.close('confirmed');
  }

}

