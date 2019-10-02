import { Injectable } from "@angular/core";
import { CalEvent } from './events.model';
import { Calendar } from './calendar-list/calendar.model';
import { CalendarService } from './calendar-list/calendar.service';
import { Subject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { DateRange } from '../appointment/appointment-model/date-range.model';
import { TimeInterval } from '../appointment/appointment-model/time-interval.model';
import { CompatibleEvent } from './compatible-events.model';

@Injectable()
export class EventService{
    eventsChanged: Subject<CompatibleEvent[]> = new Subject<CompatibleEvent[]>();
    constructor(
        private calendarService: CalendarService,
        private dataService: DataStorageService
    ){}
    calendars = this.calendarService.getCalendars();
    tempTimes: TimeInterval = {
        startTime: "1:00 PM",
        endTime: "2:00 PM",
        interv: 60
    }
    tempDate: DateRange = {
        date: "Tue Oct 01 2019 16:16:23 GMT-0500 (Central Daylight Time)",
        times: [this.tempTimes]
    }
    
    events: CompatibleEvent[] = [
        // new CalEvent(
        //     0,
        //     'test',
        //     'test',
        //     'test',
        //     ['andrew.moore9497@gmail.com'],
        //     [this.tempDate]
        // )
    ]
    

    tempEvents: CompatibleEvent[] = this.events;

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
    addEvent(e: CompatibleEvent){
        this.events.push(e);
        this.updateEvents();
    }

    //change events list
    setEvents(eventList: CompatibleEvent[]){
        this.events = eventList;
    }

    //updates list for hiding calendars
    updateEvents(){
        const newEvents: CompatibleEvent[]=[]
        // for(let event of this.events){
        //     if(event.calendar.shown){
        //         newEvents.push(event);
        //     }
        // }
        this.tempEvents = newEvents;
        return this.eventsChanged.next(this.tempEvents.slice());
    }
    

}