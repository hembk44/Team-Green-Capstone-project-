import { EventTime } from './event-times.model';

export class EventDate{
    constructor(
        public date: string,
        public times: EventTime[]
    ){}
}