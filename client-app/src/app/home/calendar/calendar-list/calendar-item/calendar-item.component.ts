import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from '../calendar.model';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css']
})
export class CalendarItemComponent implements OnInit {
  @Input()index: number;//index of calendar in list
  @Input()calendar: Calendar;//calendar object to show
  checked = true;

  constructor() { }

  ngOnInit() {
  }
  

}
