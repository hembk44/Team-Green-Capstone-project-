import { Optional } from '@angular/core';
import { Calendar } from './calendar-list/calendar.model';

export class CalEvent{
    constructor(
        public title:string,
        public start: Date,
        public end: Date,
        public users: any[],
        public description: string,
        public location: string,
        public createdBy: string,
        public calendar: Calendar
        //@Optional() public image: File
        //@Optional() public interval: string
    ){}
}