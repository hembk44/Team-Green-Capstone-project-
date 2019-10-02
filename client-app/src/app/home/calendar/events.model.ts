import { Optional } from '@angular/core';
import { Calendar } from './calendar-list/calendar.model';
import { DateRange } from '../appointment/appointment-model/date-range.model';
import { EventDate } from './event-date.model';

export class CalEvent{
    start: Date;
    end: Date;

    constructor(
        public id: number,
        public title:string,
        public description: string,
        public location: string,
        public email: string[],
        public eventdates: EventDate[]
    ){
        this.start = new Date(this.eventdates[0].date.toString().substring(0,15).concat(' ').concat(this.eventdates[0].eventtimes[0].startTime));
        this.end = new Date(this.eventdates[this.eventdates.length - 1].date.toString().substring(0,14).concat(' ').concat(this.eventdates[this.eventdates.length - 1].eventtimes[this.eventdates[this.eventdates.length-1].eventtimes.length-1].endTime));
    }
}