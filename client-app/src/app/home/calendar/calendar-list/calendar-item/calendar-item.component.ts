import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from '../calendar.model';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css']
})
export class CalendarItemComponent implements OnInit {
  @Input()index: number;
  @Input()calendar: Calendar;

  constructor() { }

  ngOnInit() {
  }
  

}
