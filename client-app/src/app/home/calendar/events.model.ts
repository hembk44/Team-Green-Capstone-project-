import { Optional } from '@angular/core';
import { Calendar } from './calendar-list/calendar.model';
import { DateRange } from '../appointment/appointment-model/date-range.model';

export class CalEvent{
    public start: Date;
    public end: Date;

    constructor(
        public id: number,
        public title:string,
        public description: string,
        public location: string,
        public email: string[],
        public dateRange: DateRange[]
    ){
        this.start = new Date(this.dateRange[0].date.toString().substring(0,15).concat(' ').concat(this.dateRange[0].times[0].startTime));
        this.end = new Date(this.dateRange[this.dateRange.length - 1].date.toString().substring(0,14).concat(' ').concat(this.dateRange[this.dateRange.length - 1].times[this.dateRange[this.dateRange.length-1].times.length-1].endTime));
    }
}