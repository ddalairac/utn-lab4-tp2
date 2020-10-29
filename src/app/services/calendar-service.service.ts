import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDays, addHours, addWeeks, endOfDay, startOfDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { Appointment, AttentionSpaces, ClinicUser, eUserTypes, Profesional, Specialties, iHorarioAtencion } from '../class/data.model';
import { eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private fbsorageservice: FbStorageService,
        private loader: LoaderService) {
        this.events$ = new BehaviorSubject<Appointment[]>([])
    }

    public events$: BehaviorSubject<Appointment[]>;


    public getCalendarEvents(): void {
        this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
            // console.log("appointments: ", list)
            this.events$.next(list);
        }).catch((error) => {
            console.error("appointments error: ", error)
        }).finally(() => this.loader.hide());
    }
    public updateCalendarEvent(id: string, event: Appointment): void {
        this.fbsorageservice.update(eCollections.appointments, id, event).then((data) => {
            // console.log("updateCalendarEvent: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.events$.next(list);
            })

        }).catch((error) => {
            console.error("updateCalendarEvent error: ", error)
        }).finally(() => this.loader.hide());
    }

    public createCalendarEvent(event: Appointment): void {
        this.fbsorageservice.create(eCollections.appointments, event).then((data) => {
            // console.log("createCalendarEvent: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.events$.next(list);
            })
        }).catch((error) => {
            console.error("createCalendarEvent error: ", error)
        }).finally(() => this.loader.hide());
    }
    public deleteCalendarEvent(id: string): void {
        this.fbsorageservice.delete(eCollections.appointments, id).then((data) => {
            // console.log("deleteCalendarEventObs: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.events$.next(list);
            })
        }).catch((error) => {
            console.error("deleteCalendarEventObs error: ", error)
        }).finally(() => this.loader.hide());
    }


    /////////////////////////////////////////////////



    async getAttentionSpaces(): Promise<AttentionSpaces[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.attentionSpaces).then((list: AttentionSpaces[]) => {
                // console.log("attentionSpaces: ", list)
                resolve(list);
            }).catch((error) => {
                console.log("attentionSpaces error: ", error)
                reject(error)
            }).finally(() => this.loader.hide());
        });
    }

    async getProfecionals(): Promise<Profesional[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.users).then((list: ClinicUser[]) => {
                let profesionals: Profesional[] = list.filter((user: ClinicUser) => user.type == eUserTypes.profesional) as Profesional[];
                // console.log("profesionals: ", profesionals)
                resolve(profesionals);
            }).catch((error) => {
                console.log("profesionals error: ", error)
                reject(error)
            }).finally(() => this.loader.hide());
        });
    }


    async getSpecialties(): Promise<Specialties[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.specialties).then((list: Specialties[]) => {
                // console.log("specialties: ", list)
                resolve(list);
            }).catch((error) => {
                console.log("specialties error: ", error)
                reject(error)
            }).finally(() => this.loader.hide());
        });
    }

    /////////////////////////////////////////////////////////

    setDisableEvent(start: Date, end: Date): CalendarEvent {
        let event: CalendarEvent<Appointment> = {
            start: start,
            end: end,
            title: '',
            color: CALCOLORS.grey
        }
        // console.log("disabled day", event)
        return event
    }


    getDisableSaturdaysEvents(): CalendarEvent[] {
        let today: Date = new Date()
        let sabado: number = today.getDate() - today.getDay() + 6; // dia mes - dia semana => domingo + 6 => sabado

        let start: Date = addHours(startOfDay(new Date(today.setDate(sabado))), 14);
        let end: Date = addHours(startOfDay(new Date(today.setDate(sabado))), 19);

        return [
            this.setDisableEvent(start, end),
            this.setDisableEvent(addWeeks(start, 1), addWeeks(end, 1)),
            this.setDisableEvent(addWeeks(start, -1), addWeeks(end, -1))
        ]
    }
    getDisableProfesionalDisablesEvents(profesional: Profesional): CalendarEvent[] {
        let events: CalendarEvent[] = []
        if (profesional) {
            let phh = profesional.horarios_atencion;
            for (let key in phh) {
                // console.log(key, dhh)
                let dhh: iHorarioAtencion = phh[key] as iHorarioAtencion;
                let day: Date = this.getWeekDaybyKey(key)
                let lasClinicHour: number = 19
                if(key == eDay.sat.toLowerCase()){
                    lasClinicHour = 14
                }
                if (dhh.active) {
                    let firsthour: number = parseInt(dhh.start.split(':')[0])
                    let lastHour: number = parseInt(dhh.end.split(':')[0])
                    let firstStart: Date = addHours(startOfDay(new Date(day)), 8)
                    let firstEnd: Date = addHours(startOfDay(new Date(day)), firsthour)

                    let lastStart: Date = addHours(startOfDay(new Date(day)), lastHour)
                    let lastEnd: Date = addHours(startOfDay(new Date(day)), lasClinicHour)

                    // console.log("pro disable dates", firstStart, firstEnd, lastStart, lastEnd)

                    let disableStart: CalendarEvent = this.setDisableEvent(firstStart, firstEnd)
                    let disableEnd: CalendarEvent = this.setDisableEvent(lastStart, lastEnd)
                    events = [...events, disableStart, disableEnd]
                } else {
                    let start: Date = addHours(startOfDay(new Date(day)), 8)
                    let end: Date = addHours(startOfDay(new Date(day)), lasClinicHour)
                    let disableDay: CalendarEvent = this.setDisableEvent(start, end)
                    events = [...events, disableDay]
                }
            }
        }
        console.log("pro disable events", events)
        return events
    }
    getWeekDaybyKey(key: eDay | string): Date {
        let day: Date
        let today: Date = new Date()
        let domingo: number = today.getDate() - today.getDay()// dia mes - dia semana => domingo
        switch (key) {
            case eDay.mon.toLowerCase():
                day = addDays(new Date(today.setDate(domingo)), 1)
                break
            case eDay.tue.toLowerCase():
                day = addDays(new Date(today.setDate(domingo)), 2)
                break
            case eDay.wed.toLowerCase():
                day = addDays(new Date(today.setDate(domingo)), 3)
                break
            case eDay.thu.toLowerCase():
                day = addDays(new Date(today.setDate(domingo)), 4)
                break
            case eDay.fri.toLowerCase():
                day = addDays(new Date(today.setDate(domingo)), 5)
                break
            case eDay.sat.toLowerCase():
                day = addDays(new Date(today.setDate(domingo)), 6)
                break
        }
        return day
    }
}


export enum eDay {
    mon = 'Mon', tue = 'Tue', wed = 'Wed', thu = 'Thu', fri = 'Fri', sat = 'Sat'
}

export const DAYS = [eDay.mon, eDay.tue, eDay.wed, eDay.thu, eDay.fri, eDay.sat];

export const CALCOLORS: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    grey: {
        primary: '#666',
        secondary: '#CCC'
    },
    green: {
        primary: '#72e308',
        secondary: '#cffdba'
    }
};
