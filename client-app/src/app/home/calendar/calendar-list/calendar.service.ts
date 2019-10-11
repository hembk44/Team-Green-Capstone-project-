import { Injectable } from "@angular/core";
import { Calendar } from './calendar.model';
import { CalEvent } from '../events.model';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class CalendarService{
    eventsChanged = new Subject<CalEvent[]>();
    newCals: Calendar[] = [];
    calendars: Calendar[]=[
        {
            id: 1,
            name: "Main",
            events: [{
                id: 0,
                title: "The best event",
                description: "This is a test",
                location: "Test Location",
                start: new Date("10/11/2019"),
                end: new Date("10/11/2019"),
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
                start: new Date("10/11/2019 2:00 PM"),
                end: new Date("10/11/2019 4:00 PM"),
                color: {
                    primary: "#800029",
                    secondary: "#f2968f"
                },
                allDay: false
            }],
            shown: true,
            createdBy: "moorea1"
        },
        {
            id: 2,
            name: "Main 2",
            events: [{
                id: 3,
                title: "The best event 3",
                description: "This is a test",
                location: "Test Location",
                start: new Date("10/11/2019"),
                end: new Date("10/11/2019"),
                color: {
                    primary: "#800029",
                    secondary: "#f2968f"
                },
                allDay: true
            },
            {
                id: 4,
                title: "The best event 4",
                description: "This is a test",
                location: "Test Location",
                start: new Date("10/10/2019 1:00 PM"),
                end: new Date("10/10/2019 4:00 PM"),
                color: {
                    primary: "#800029",
                    secondary: "#f2968f"
                },
                allDay: false
            }],
            shown: true,
            createdBy: "moorea1"
        }
    ];
    events: CalEvent[] = [];
    //returns calendars
    getCalendars(){
        return this.calendars.slice();
    }

    getCalendars2(name: string){
        this.newCals = [];
        for(let cal of this.calendars){
            if(cal.createdBy === name){
                this.newCals.push(cal);
            }
        }
        return this.newCals;
    }

    //sets calendar list
    setCalendars(cals: Calendar[]){
        this.calendars = cals;
    }

    getEvents(){
        this.events=[];
        for(let cal of this.calendars){
            if (cal.shown){
                for(let event of cal.events){
                    this.events.push(event);
                }
            }
        }
        return this.events.slice();
    }

    updateEvents(){
        this.events = [];
        for(let cal of this.calendars){
            if (cal.shown){
                for(let event of cal.events){
                    this.events.push(event);
                }
            }
        }
        this.eventsChanged.next(this.events);
    }

    toggleCalendar(cal: Calendar){
        cal.shown = !cal.shown;
        this.updateEvents();
    }
    getEvent(id: number){
        const event = this.events.find(event => event.id === id);
        return event;
    }
    addEvent(event: CalEvent){
        this.events.push(event);
    }
}