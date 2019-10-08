import { CalEvent } from '../events.model';

export class Calendar{
    constructor(
        public id: number,
        public name: string,
        public events: CalEvent[],
        public createdBy: string,
        public shown: boolean,
        public users?: string[]
    ){}
}