import { Color } from './colors.model';

export class CalEvent{

    constructor(
        public id: number,
        public title:string,
        public description: string,
        public location: string,
        public start: Date,
        public end: Date,
        public colors: Color,
        public email?: string[]
    ){}
}