import { Component, OnInit, Inject } from '@angular/core';
import { CalendarService } from '../calendar-list/calendar.service';
import { ActivatedRoute, Params } from '@angular/router';
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
    private route: ActivatedRoute,
    private ref: MatDialogRef<EventDetailComponent>,
    @Inject(MAT_DIALOG_DATA)public data: number) { }

  ngOnInit() {
    this.id = this.data
    // this.route.params.subscribe((params: Params)=>{
    //   this.id = +params['id'];
    // })
    this.event = this.calService.getEvent(this.id);
  }

  close(){
    this.ref.close();
  }

}
