import { Injectable } from "@angular/core";
import { CalEvent } from './events.model';
import { Calendar } from './calendar-list/calendar.model';
import { CalendarService } from './calendar-list/calendar.service';
import { Subject } from 'rxjs';

@Injectable()
export class EventService{
    eventsChanged: Subject<CalEvent[]> = new Subject<CalEvent[]>();
    constructor(
        private calendarService: CalendarService
    ){}
    calendars = this.calendarService.getCalendars();
    events: CalEvent[] = [
        {
            title: 'Test Event',
            start: new Date(2019,8,23,12),
            end: new Date(2019,8,23,15,20),
            createdBy: 'test',
            users: ['moorea1'],
            description: 'test event',
            location: 'test location',
            calendar: this.calendars[0]
        },
        {
            title: 'Test Event 2',
            start: new Date(2019,8,23,12),
            end: new Date(2019,8,26,15,20),
            createdBy: 'test',
            users: ['moorea1'],
            description: 'test event',
            location: 'test location',
            calendar: this.calendars[1]
        },
        {
            title: 'Test Event 3',
            start: new Date(2019,8,23,12),
            end: new Date(2019,8,23,15,20),
            createdBy: 'test',
            users: ['moorea1'],
            description: 'test event',
            location: 'test location',
            calendar: this.calendars[2]
        }
    ];
    tempEvents: CalEvent[] = this.events;

    getEvents(){
        const ev: CalEvent[]=[];
        for(let event of this.events){
            if(event.calendar.shown){
                ev.push(event);
            }
        }
        return ev.slice();
    }

    addEvent(e: CalEvent){
        this.events.push(e);
        this.updateEvents();
    }

    setEvents(eventList: CalEvent[]){
        this.events = eventList;
    }

    updateEvents(){
        const newEvents: CalEvent[]=[]
        for(let event of this.events){
            if(event.calendar.shown){
                newEvents.push(event);
            }
        }
        this.tempEvents = newEvents;
        return this.eventsChanged.next(this.tempEvents.slice());
    }
    

}