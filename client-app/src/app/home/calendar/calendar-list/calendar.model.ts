import { CalEvent } from '../events.model';

export class Calendar{
    constructor(
        public id: number,
        public defaultCalendar: boolean,
        public name: string,
        public events: CalEvent[],
        public createdBy: any,
        public color: string,
        public shown: boolean,
        public shareduser: any[]
    ){}
}