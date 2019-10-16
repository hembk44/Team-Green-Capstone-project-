import { Component, OnInit, Inject } from '@angular/core';
import { CalendarService } from '../calendar-list/calendar.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CalEvent } from '../events.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  id:number;
  event: CalEvent;

  constructor(private calService: CalendarService,
    private router: Router,
    private ref: MatDialogRef<EventDetailComponent>,
    @Inject(MAT_DIALOG_DATA)public data: CalEvent) { 
    }

  ngOnInit() {
    this.event = this.data;
    console.log(this.event);
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

  }

}
