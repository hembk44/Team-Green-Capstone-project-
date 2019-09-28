import { Injectable } from "@angular/core";
import { Calendar } from './calendar.model';

@Injectable()
export class CalendarService{
    calendars: Calendar[] = [
        {
            user: 'moorea1',
            name: 'main',
            createdBy: 'moorea1',
            shown:true
        },
        {
            user: 'moorea1',
            name: 'appointments',
            createdBy: 'moorea1',
            shown:true
        },
        {
            user: 'moorea1',
            name: 'CSCI4060',
            createdBy: 'moorea1',
            shown:false
        }
    ];

    getCalendars(){
        return this.calendars.slice();
    }
    setCalendars(cals: Calendar[]){
        this.calendars = cals;
    }
}