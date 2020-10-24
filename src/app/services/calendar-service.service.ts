import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs';
import { Appointment, AttentionSpaces, ClinicUser, eUserTypes, Profesional, Specialties } from '../class/data.model';
import { eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private fbsorageservice: FbStorageService) {
        this.events$ = new BehaviorSubject<Appointment[]>([])
    }

    public events$: BehaviorSubject<Appointment[]>;


    public getCalendarEvents(): void {
        this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
            console.log("appointments: ", list)
            this.events$.next(list);
        }).catch((error) => {
            console.log("appointments error: ", error)
        })
    }
    public updateCalendarEvent(id: string, event: Appointment): void {
        this.fbsorageservice.update(eCollections.appointments, id, event).then((data) => {
            console.log("updateCalendarEvent: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.events$.next(list);
            })

        }).catch((error) => {
            console.log("updateCalendarEvent error: ", error)
        })
    }

    public createCalendarEvent(event: Appointment): void {
        this.fbsorageservice.create(eCollections.appointments, event).then((data) => {
            console.log("createCalendarEvent: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.events$.next(list);
            })
        }).catch((error) => {
            console.log("createCalendarEvent error: ", error)
        })
    }
    public deleteCalendarEvent(id: string): void  {
        this.fbsorageservice.delete(eCollections.appointments, id).then((data) => {
            console.log("deleteCalendarEventObs: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.events$.next(list);
            })
        }).catch((error) => {
            console.log("deleteCalendarEventObs error: ", error)
        })
    }


    /////////////////////////////////////////////////



    async getAttentionSpaces(): Promise<AttentionSpaces[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.attentionSpaces).then((list: AttentionSpaces[]) => {
                console.log("attentionSpaces: ", list)
                resolve(list);
            }).catch((error) => {
                console.log("attentionSpaces error: ", error)
                reject(error)
            })
        });
    }

    async getProfecionals(): Promise<Profesional[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.users).then((list: ClinicUser[]) => {
                let profesionals: Profesional[] = list.filter((user: ClinicUser) => user.type == eUserTypes.profesional) as Profesional[];
                console.log("profesionals: ", profesionals)
                resolve(profesionals);
            }).catch((error) => {
                console.log("profesionals error: ", error)
                reject(error)
            })
        });
    }


    async getSpecialties(): Promise<Specialties[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.specialties).then((list: Specialties[]) => {
                console.log("specialties: ", list)
                resolve(list);
            }).catch((error) => {
                console.log("specialties error: ", error)
                reject(error)
            })
        });
    }
}


export const calColor: any = {
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