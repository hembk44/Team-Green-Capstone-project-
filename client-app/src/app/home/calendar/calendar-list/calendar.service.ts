import { Injectable } from "@angular/core";
import { Calendar } from './calendar.model';

@Injectable()
export class CalendarService{
    calendars: Calendar[]=[];
    //list of calendars for testing
    // calendars: Calendar[] = [
    //     {
    //         users: ['moorea1'],
    //         name: 'main',
    //         createdBy: 'moorea1',
    //         shown:true
    //     },
    //     {
    //         users: ['moorea1'],
    //         name: 'appointments',
    //         createdBy: 'moorea1',
    //         shown:true
    //     },
    //     {
    //         users: ['moorea1'],
    //         name: 'CSCI4060',
    //         createdBy: 'moorea1',
    //         shown:false
    //     }
    // ];

    //returns calendars
    getCalendars(){
        return this.calendars.slice();
    }

    //sets calendar list
    setCalendars(cals: Calendar[]){
        this.calendars = cals;
    }
}