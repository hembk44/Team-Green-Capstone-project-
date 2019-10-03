import { Optional } from "@angular/core";
import { Calendar } from "./calendar-list/calendar.model";
import { DateRange } from "../appointment/appointment-model/date-range.model";
import { EventDate } from "./event-date.model";

export class CalEvent{

    constructor(
        public id: number,
        public name:string,
        public description: string,
        public location: string,
        public eventdates: EventDate[],
        public email?: string[]
    ){}
}