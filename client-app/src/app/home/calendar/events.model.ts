import { Color } from './colors.model';

export class CalEvent{

    constructor(
        public id: number,
        public title:string,
        public description: string,
        public location: string,
        // public backgroundColor: string,
        // public borderColor: string,
        public start: Date,
        public end: Date,
        public allDay: boolean,
        public email?: string[],
    ){}
}