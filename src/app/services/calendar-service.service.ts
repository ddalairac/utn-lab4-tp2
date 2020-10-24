import { Injectable } from '@angular/core';
import { Appointment, AttentionSpaces, ClinicUser, eUserTypes, Profesional, Specialties } from '../class/data.model';
import { eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private fbsorageservice: FbStorageService) { }


    async getCalendarEvents(): Promise<Appointment[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                console.log("appointments: ", list)
                resolve(list);
            }).catch((error) => {
                console.log("appointments error: ", error)
                reject(error)
            })
        });
    }
    async updateCalendarEvent(id: string, event: Appointment): Promise<Appointment[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.update(eCollections.appointments, id, event).then((data) => {
                console.log("updateCalendarEvent: ", data)
                this.getCalendarEvents().then((list: Appointment[]) => {
                    resolve(list);
                })

            }).catch((error) => {
                console.log("updateCalendarEvent error: ", error)
                reject(error)
            })
        });
    }

    async createCalendarEvent(event: Appointment): Promise<Appointment[]> {
        return new Promise((resolve, reject) => {
            this.fbsorageservice.create(eCollections.appointments, event).then((data) => {
                console.log("createCalendarEvent: ", data)
                this.getCalendarEvents().then((list: Appointment[]) => {
                    resolve(list);
                })
            }).catch((error) => {
                console.log("createCalendarEvent error: ", error)
                reject(error)
            })
        });
    }



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
    // blue: {
    //     primary: '#1e90ff',
    //     secondary: '#D1E8FF'
    // },
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