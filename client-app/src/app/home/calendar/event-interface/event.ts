import { DateRange } from '../../appointment/appointment-model/date-range.model';

// import { IAppointmentDate } from '../../appointment/appointment-interfaces/appointment-date';

export interface ICalEvent{
    id: number;
    name: string;
    description: string;
    email?: string[];
    dates: DateRange[];
}