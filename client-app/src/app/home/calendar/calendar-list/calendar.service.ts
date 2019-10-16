import { Injectable } from "@angular/core";
import { Calendar } from './calendar.model';
import { CalEvent } from '../events.model';

@Injectable()
export class CalendarService{
<<<<<<< HEAD
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

=======
    calendars: Calendar[]=[
        {
            id: 1,
            name: "Main",
            events: [{
                id: 0,
                title: "The best event",
                description: "This is a test",
                location: "Test Location",
                start: new Date(),
                end: new Date("10/10/2019"),
                color: {
                    primary: "#800029",
                    secondary: "#f2968f"
                },
                allDay: true
            },
            {
                id: 1,
                title: "The best event 2",
                description: "This is a test",
                location: "Test Location",
                start: new Date(),
                end: new Date("10/9/2019 4:00 PM"),
                color: {
                    primary: "#800029",
                    secondary: "#f2968f"
                },
                allDay: false
            }],
            shown: true,
            createdBy: "moorea1"
        },
        
    ];
    events: CalEvent[] = [];
>>>>>>> rohan/beta-demo
    //returns calendars
    getCalendars(){
        return this.calendars.slice();
    }

    //sets calendar list
    setCalendars(cals: Calendar[]){
        this.calendars = cals;
    }

    getEvents(){
        for(let cal of this.calendars){
            if (cal.shown){
                for(let event of cal.events){
                    this.events.push(event);
                }
            }
        }
        return this.events.slice();
    }
}