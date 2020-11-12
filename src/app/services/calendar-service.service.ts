import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDays, addHours, addMinutes, addWeeks, endOfDay, startOfDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { Appointment, AttentionSpaces, ClinicUser, eUserTypes, Profesional, Specialties, iHorarioAtencion, eSpacesTypes, Patient } from '../class/data.model';
import { eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private fbsorageservice: FbStorageService,
        private loader: LoaderService) {
        this.appointments$ = new BehaviorSubject<Appointment[]>([]);
    }

    public appointments$: BehaviorSubject<Appointment[]>;


    public setCalendarAppointments(): void {
        this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
            console.log("setCalendarAppointments: ", list)
            this.appointments$.next(list);
        }).catch((error) => {
            console.error("appointments error: ", error)
        }).finally(() => this.loader.hide());
    }
    public updateCalendarEvent(id: string, event: Appointment): void {
        this.fbsorageservice.update(eCollections.appointments, id, event).then((data) => {
            // console.log("updateCalendarEvent: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.appointments$.next(list);
            })
        }).catch((error) => {
            console.error("updateCalendarEvent error: ", error)
        }).finally(() => this.loader.hide());
    }

    public createCalendarEvent(event: Appointment): void {
        this.fbsorageservice.create(eCollections.appointments, event).then((data) => {
            // console.log("createCalendarEvent: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.appointments$.next(list);
            })
        }).catch((error) => {
            console.error("createCalendarEvent error: ", error)
        }).finally(() => this.loader.hide());
    }
    public deleteCalendarEvent(id: string): void {
        this.fbsorageservice.delete(eCollections.appointments, id).then((data) => {
            // console.log("deleteCalendarEventObs: ", data)
            this.fbsorageservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
                this.appointments$.next(list);
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
                resolve([])
                // reject(error)
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
                resolve([])
                // reject(error)
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
                resolve([])
                // reject(error)
            }).finally(() => this.loader.hide());
        });
    }

    /////////////////////////////////////////////////////////

    private setDisableEvent(start: Date, end: Date): CalendarEvent {
        let event: CalendarEvent<Appointment> = {
            start: start,
            end: end,
            title: '',
            color: CALCOLORS.grey
        }
        // console.log("disabled day", event)
        return event
    }
    private setDisableAppointment(start: Date, end: Date): Appointment {
        let appointment: Appointment = {
            space: eSpacesTypes.laboratory,
            spaceName: '1',
            profesional: new Profesional(eUserTypes.profesional, '', '', ''),
            specialty: '',
            start: start.toString(),
            end: end.toString(),
            patient: new Patient(eUserTypes.patient, '', '', ''),
            acceptance: false,
            clinicHistoryCompleted: false
        }
        // console.log("disabled day", appointment)
        return appointment
    }
    private getWeekDaybyKey(key: eDay | string): Date {
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
    public getDisableSaturdaysEvents(): CalendarEvent<Appointment>[] {
        let appointments: Appointment[] = this.getDisableSaturdaysAppointments()
        let events: CalendarEvent<Appointment>[] = []
        appointments.forEach(ap => {
            events.push(this.setDisableEvent(new Date(ap.start), new Date(ap.end)))
        });
        return events
    }
    public getDisableProfesionalDisablesEvents(profesional: Profesional): CalendarEvent<Appointment>[] {
        let appointments: Appointment[] = this.getDisableProfesionalDisablesAppointments(profesional)
        let events: CalendarEvent<Appointment>[] = []
        appointments.forEach(ap => {
            events.push(this.setDisableEvent(new Date(ap.start), new Date(ap.end)))
        });
        console.log("pro disable events", events)
        return events
    }
    public getDisableSaturdaysAppointments(): Appointment[] {
        let today: Date = new Date()
        let sabado: number = today.getDate() - today.getDay() + 6; // dia mes - dia semana => domingo + 6 => sabado

        let start: Date = addHours(startOfDay(new Date(today.setDate(sabado))), 14);
        let end: Date = addHours(startOfDay(new Date(today.setDate(sabado))), 19);

        return [
            this.setDisableAppointment(start, end),
            this.setDisableAppointment(addWeeks(start, 1), addWeeks(end, 1))
        ]
    }
    public getDisableProfesionalDisablesAppointments(profesional: Profesional): Appointment[] {
        let appointments: Appointment[] = []
        if (profesional) {
            let phh = profesional.horarios_atencion;
            for (let key in phh) {
                // console.log(key, dhh)
                let dhh: iHorarioAtencion = phh[key] as iHorarioAtencion;
                let day: Date = this.getWeekDaybyKey(key)
                let lasClinicHour: number = 19
                if (key == eDay.sat.toLowerCase()) {
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

                    let disableStart: Appointment = this.setDisableAppointment(firstStart, firstEnd)
                    let disableEnd: Appointment = this.setDisableAppointment(lastStart, lastEnd)
                    let disableStartWeek2: Appointment = this.setDisableAppointment(addWeeks(firstStart, 1), addWeeks(firstEnd, 1))
                    let disableEndWeek2: Appointment = this.setDisableAppointment(addWeeks(lastStart, 1), addWeeks(lastEnd, 1))
                    appointments = [...appointments, disableStart, disableEnd, disableStartWeek2, disableEndWeek2]
                } else {
                    let start: Date = addHours(startOfDay(new Date(day)), 8)
                    let end: Date = addHours(startOfDay(new Date(day)), lasClinicHour)
                    let disableDay: Appointment = this.setDisableAppointment(start, end)
                    let disableDayWeek2: Appointment = this.setDisableAppointment(addWeeks(start, 1), addWeeks(end, 1))

                    appointments = [...appointments, disableDay, disableDayWeek2]
                }
            }
        }
        console.log("pro disable appointments", appointments)
        return appointments
    }
    public isOutOfProTime(appointment: Appointment, profesional: Profesional): boolean {
        if (profesional && appointment && appointment.profesional.id == profesional.id) {
            let phh = profesional.horarios_atencion;
            for (let key in phh) {
                // console.log(key, dhh)
                let dhh: iHorarioAtencion = phh[key] as iHorarioAtencion;
                let day: Date = this.getWeekDaybyKey(key)
                let lasClinicHour: number = 19
                if (key == eDay.sat.toLowerCase()) {
                    lasClinicHour = 14
                }

                if (!dhh.active) {// si no atiende ese dia
                    return true
                } else { // Si empeza antes o termina despues del horario del medico
                    let profirsthour: number = parseInt(dhh.start.split(':')[0]);
                    let prolastHour: number = parseInt(dhh.end.split(':')[0]);
                    let proStart: Date = addHours(startOfDay(new Date(day)), profirsthour);
                    let proEnd: Date = addHours(startOfDay(new Date(day)), prolastHour)
                    let apStart: Date = new Date(appointment.start);
                    let apEnd: Date = new Date(appointment.end);
                    if (apStart < proStart) return true
                    if (apEnd > proEnd) return true
                }
            }
            return false
        }
    }
    public async getAvailableAppointment(profesional: Profesional, speciality: string, patient: Patient) {//:Appointment || null
        return new Promise(async(resolve, reject) => {
            let appDuration: number = profesional.tiempoTurno
            console.log("getAvailableAppointment appDuration", appDuration)
            let appointments: Appointment[] = []
            try {
                appointments = this.appointments$.getValue()
            } catch (error) {
                console.error("getAvailableAppointment",appointments)
            }
            console.log("getAvailableAppointment appointments", appointments)
            appointments = [
                ...appointments,
                ...this.getDisableSaturdaysAppointments(),
                ...this.getDisableProfesionalDisablesAppointments(profesional)
            ]
            if (profesional) {
                let phh = profesional.horarios_atencion;
                for (let dayKey in phh) {
                    let dhh: iHorarioAtencion = phh[dayKey] as iHorarioAtencion;
                    let day: Date = this.getWeekDaybyKey(dayKey)
                    console.log(dayKey, dhh, day)
                    if (dhh.active) {
                        let firsthour: number = parseInt(dhh.start.split(':')[0])
                        let lastHour: number = parseInt(dhh.end.split(':')[0])
                        let first: Date = addHours(startOfDay(new Date(day)), firsthour)
                        let last: Date = addHours(startOfDay(new Date(day)), lastHour)
                        this.findAvailableAppointmentInDay(first, last, appointments, appDuration)
                    }
                }
            }
            resolve(true)
        })
    }
    private findAvailableAppointmentInDay(first: Date, last: Date, appointments: Appointment[], appDuration: number) {
        let search = true
        let newApStart: Date = new Date(first)
        let newApEnd: Date = addMinutes(new Date(first), appDuration)
        console.log("Turnos buscar", newApStart, newApEnd)
        // do {
        //     appointments.forEach(ap => {
        //         let apStart: Date = new Date(ap.start)
        //         let apEnd: Date = new Date(ap.end)
        //         if (first >= apStart && apEnd <= last) {




        //         }
        //     });    //statements 
        // } while (search)
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
