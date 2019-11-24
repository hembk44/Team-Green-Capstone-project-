import { Component, OnInit, Inject } from '@angular/core';
import { CalendarService } from '../calendar-list/calendar.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CalEvent } from '../events.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { DataStorageService } from '../../shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ShareEvent } from './share-event';
import { RecursiveTemplateAstVisitor } from '@angular/compiler';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  id:number;
  event: any;
  newEnd: Date;
  isAppt: boolean;
  username: string;
  viewAttendees: boolean;
  guests: any[];
  invitees: any[];

  constructor(private calService: CalendarService,
    private router: Router,
    private ref: MatDialogRef<EventDetailComponent>,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private dataStorage: DataStorageService,
    @Inject(MAT_DIALOG_DATA)public data: CalEvent) { 
    }

  ngOnInit() {
    this.viewAttendees = false;
    this.invitees = [];
    this.event = this.data;
    this.username = this.authService.name;
    if(this.event.allDay && this.event.end){
      this.newEnd = this.event.end;
      this.newEnd.setDate(this.event.end.getDate()-1);
    }
    if(this.event.extendedProps.timeSlotId){
      this.isAppt = true;
    } else{
      this.isAppt = false;
    }
    this.guests = this.event.extendedProps.confirmedBy;
    for(let user of this.event.extendedProps.recipients){
      this.invitees.push(user.email);
    }
    console.log(this.guests);
    console.log(this.event);
  }

  close(){
    this.ref.close();
  }

  onNoClick(){
    this.ref.close();
  }

  viewGuests(){
    this.viewAttendees = !this.viewAttendees;
  }

  editEvent(){
    this.ref.close();
    this.router.navigate(["home/edit-event", this.event.id])
  }

  deleteEvent(){
    const dialogRef = this.dialog.open(EventDeleteConfirm, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'confirmed'){
        this.dataStorage.deleteEvent(this.event.id).subscribe(result => {
          this.snackbar.open(result.message, 'OK', {duration: 5000});
          this.ref.close();
          this.dataStorage.fetchCalendars();
        });

      }
    })
  }

  shareEvent(){
    const dialogRef = this.dialog.open(ShareEvent, {
      width: "400px",
      height: "350px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== 'cancel'){
        const obj = {
          eventId: +this.event.id,
          recipients: result
        }
        this.dataStorage.shareEvent(obj).subscribe(result => {
          this.snackbar.open(result.message, 'OK', {duration: 5000})
        });
        this.dataStorage.fetchCalendars();
      }
    })

  }

  confirmAttendance(){
    this.dataStorage.userConfirmEvent(this.event.id).subscribe(result => {
      this.snackbar.open(result.message, 'OK',{duration: 5000})
    })
  }

}

@Component({
  selector: 'confirm-event-delete',
  templateUrl: 'event-delete-confirm.html',
  styleUrls: ['./event-detail.component.css']
})

export class EventDeleteConfirm{
  constructor(
    private ref: MatDialogRef<EventDeleteConfirm>
  ){}

  delete(){
    this.ref.close('confirmed')
  }

  close(){
    this.ref.close('cancel');
  }
}
