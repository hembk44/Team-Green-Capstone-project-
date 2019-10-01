import { Injectable } from "@angular/core";
import { CalEvent } from './events.model';
import { Calendar } from './calendar-list/calendar.model';
import { CalendarService } from './calendar-list/calendar.service';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { DateRange } from '../appointment/appointment-model/date-range.model';
import { TimeInterval } from '../appointment/appointment-model/time-interval.model';

@Injectable()
export class EventService{
    eventsChanged: Subject<CalEvent[]> = new Subject<CalEvent[]>();
    constructor(
        private calendarService: CalendarService,
    ){}
    calendars = this.calendarService.getCalendars();
    tempTimes: TimeInterval = {
        startTime: "1300",
        endTime: "1400",
        interv: 60
    }
    tempDate: DateRange = {
        date: "Tue Oct 01 2019 16:16:23 GMT-0500 (Central Daylight Time)",
        times: [this.tempTimes]
    }
    
    events: CalEvent[] = [
    // list for testing
        {
            title: "test event",
            description: "this is a test",
            location: "test location",
            email: [],
            dateRange: [this.tempDate]
        }
    ];

    tempEvents: CalEvent[] = this.events;

    // returns events
    getEvents(){
        

        // for(let event of this.events){
        //     if(event.calendar.shown){
        //         ev.push(event);
        //     }
        // }
        return this.events.slice();
    }

    //add events to list
    addEvent(e: CalEvent){
        this.events.push(e);
        this.updateEvents();
    }

    //change events list
    setEvents(eventList: CalEvent[]){
        this.events = eventList;
    }

    //updates list for hiding calendars
    updateEvents(){
        const newEvents: CalEvent[]=[]
        // for(let event of this.events){
        //     if(event.calendar.shown){
        //         newEvents.push(event);
        //     }
        // }
        this.tempEvents = newEvents;
        return this.eventsChanged.next(this.tempEvents.slice());
    }
    

}