import { Component, OnInit, Inject } from '@angular/core';
import { CalendarService } from '../calendar-list/calendar.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CalEvent } from '../events.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  id:number;
  event: CalEvent;
  newEnd: Date;

  constructor(private calService: CalendarService,
    private router: Router,
    private ref: MatDialogRef<EventDetailComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)public data: CalEvent) { 
    }

  ngOnInit() {
    this.event = this.data;
    if(this.event.allDay && this.event.end){
      this.newEnd = this.event.end;
      this.newEnd.setDate(this.event.end.getDate()-1);
      console.log(this.newEnd);
    }
  }

  close(){
    this.ref.close();
  }

  onNoClick(){
    this.ref.close();
  }

  editEvent(){
    this.ref.close();
    this.router.navigate(["home/edit-event", this.event.id])
  }

  deleteEvent(){
    this.dialog.open(EventDeleteConfirm, {
      width: "300px"
    });
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

  close(){
    this.ref.close();
  }
}
