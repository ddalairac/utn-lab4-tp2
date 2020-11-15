import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDays, addHours, addMinutes, addWeeks, endOfDay, startOfDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { Appointment, AttentionSpaces, ClinicUser, eUserTypes, Profesional, Specialties, iHorarioAtencion, eSpacesTypes, Patient } from '../class/data.model';
import { eCollections } from '../class/firebase.model';
import { FbDBService } from './fb-db.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private fbDBservice: FbDBService,
        private loader: LoaderService) {
        this.appointments$ = new BehaviorSubject<Appointment[]>([]);
    }

    public appointments$: BehaviorSubject<Appointment[]>;

    private apDatesToTimestamp(appointment: Appointment): Appointment {
        if (typeof appointment.start == 'object') {
            appointment.start = (appointment.start as Date).getTime() as number
        }
        if (typeof appointment.end == 'object') {
            appointment.end = (appointment.end as Date).getTime() as number
        }
        return appointment
    }
    private apTimestampToDate(appointment: Appointment): Appointment {
        if (typeof appointment.start == 'number') {
            appointment.start = new Date(appointment.start)
        }
        if (typeof appointment.end == 'number') {
            appointment.end = new Date(appointment.end)
        }
        return appointment
    }
    public sortAppointments(list: Appointment[]){
        return list.sort((a:Appointment,b:Appointment)=>{
            if (a.start > b.start) return 1
            if (a.start < b.start) return -1
            return 0
        })
    }
    public getAppointmentsList(): void {
        this.fbDBservice.readAll(eCollections.appointments).then((list: Appointment[]) => {
            list = list.map((itm) => { return this.apTimestampToDate(itm) })
            list = this.sortAppointments(list)
            console.log("getAppointmentsList: ", list)
            this.appointments$.next(list);
        }).catch((error) => {
            console.error("getAppointmentsList error: ", error)
        }).finally(() => this.loader.hide());
    }
    public updateAppointment(id: string, event: Appointment): void {
        event = this.apDatesToTimestamp(event)
        this.fbDBservice.update(eCollections.appointments, id, event).then((data) => {
            // console.log("updateAppointment: ", data)
            this.getAppointmentsList();
        }).catch((error) => {
            console.error("updateAppointment error: ", error)
        }).finally(() => this.loader.hide());
    }
    public createAppointment(event: Appointment): void {
        event = this.apDatesToTimestamp(event)
        this.fbDBservice.create(eCollections.appointments, event).then((data) => {
            // console.log("createAppointment: ", data)
            this.getAppointmentsList();
        }).catch((error) => {
            console.error("createAppointment error: ", error)
        }).finally(() => this.loader.hide());
    }
    public deleteAppointment(id: string): void {
        this.fbDBservice.delete(eCollections.appointments, id).then((data) => {
            // console.log("deleteAppointment: ", data)
            this.getAppointmentsList();
        }).catch((error) => {
            console.error("deleteAppointment error: ", error)
        }).finally(() => this.loader.hide());
    }

    /////////////////////////////////////////////////

    async getAttentionSpaces(): Promise<AttentionSpaces[]> {
        return new Promise((resolve, reject) => {
            this.fbDBservice.readAll(eCollections.attentionSpaces).then((list: AttentionSpaces[]) => {
                // console.log("attentionSpaces: ", list)
                resolve(list);
            }).catch((error) => {
                console.error("attentionSpaces error: ", error)
                resolve([])
                // reject(error)
            }).finally(() => this.loader.hide());
        });
    }
    async getProfecionals(): Promise<Profesional[]> {
        return new Promise((resolve, reject) => {
            this.fbDBservice.readAll(eCollections.users).then((list: ClinicUser[]) => {
                let profesionals: Profesional[] = list.filter((user: ClinicUser) => user.type == eUserTypes.profesional) as Profesional[];
                // console.log("profesionals: ", profesionals)
                resolve(profesionals);
            }).catch((error) => {
                console.error("profesionals error: ", error)
                resolve([])
                // reject(error)
            }).finally(() => this.loader.hide());
        });
    }
    async getSpecialties(): Promise<Specialties[]> {
        return new Promise((resolve, reject) => {
            this.fbDBservice.readAll(eCollections.specialties).then((list: Specialties[]) => {
                // console.log("specialties: ", list)
                resolve(list);
            }).catch((error) => {
                console.error("specialties error: ", error)
                resolve([])
                // reject(error)
            }).finally(() => this.loader.hide());
        });
    }

    /////////////////////////////////////////////////////////

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
    public getDisableProfesionalAppointments(profesional: Profesional): Appointment[] {
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
        // console.log("pro disable appointments", appointments)
        return appointments
    }
    private setAppointment(start: Date, end: Date, profesional: Profesional, speciality: string, patient: Patient, spaceName: string = '1', space: eSpacesTypes = eSpacesTypes.laboratory): Appointment {
        let appointment: Appointment = {
            space: space,
            spaceName: spaceName,
            profesional: profesional,
            specialty: speciality,
            start: start,
            end: end,
            patient: patient,
            acceptance: false,
            clinicHistoryCompleted: false
        }
        // console.log("disabled day", appointment)
        return appointment
    }
    private setDisableAppointment(start: Date, end: Date): Appointment {
        return this.setAppointment(start, end, new Profesional(eUserTypes.profesional, '', '', ''), '', new Patient(eUserTypes.patient, '', '', ''))
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
    private getDayName(date: Date): string {
        return date.toString().split(' ')[0]
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
    public getDisableSaturdaysEvents(): CalendarEvent<Appointment>[] {
        let appointments: Appointment[] = this.getDisableSaturdaysAppointments()
        let events: CalendarEvent<Appointment>[] = []
        appointments.forEach(ap => {
            events.push(this.setDisableEvent(new Date(ap.start), new Date(ap.end)))
        });
        return events
    }
    public getDisableProfesionalEvents(profesional: Profesional): CalendarEvent<Appointment>[] {
        let appointments: Appointment[] = this.getDisableProfesionalAppointments(profesional)
        let events: CalendarEvent<Appointment>[] = []
        appointments.forEach(ap => {
            events.push(this.setDisableEvent(new Date(ap.start), new Date(ap.end)))
        });
        // console.log("pro disable events", events)
        return events
    }

    public async getAvailableAppointment(profesional: Profesional, speciality: string, patient: Patient): Promise<Appointment | null> {
        return new Promise(async (resolve, reject) => {
            let appDuration: number = profesional.tiempoTurno
            // console.log("getAvailableAppointment appDuration", appDuration)
            let appointments: Appointment[] = []
            try {
                appointments = this.appointments$.getValue()
            } catch (error) {
                console.error("getAvailableAppointment", appointments)
            }
            // console.log("getAvailableAppointment appointments", appointments)
            appointments = [
                ...appointments,
                ...this.getDisableSaturdaysAppointments(),
                ...this.getDisableProfesionalAppointments(profesional)
            ]
            appointments = this.sortAppointments(appointments)
            // console.log("appointments", appointments)
            if (profesional) {
                let phh = profesional.horarios_atencion;

                let totalDaysToCheck: number = 12
                let dayCount: number = 0
                let today = new Date(Date.now())

                for (let index = 0; index < totalDaysToCheck; index++) {
                    let day: Date = addDays(today, index)
                    let dayName = this.getDayName(day)
                    let dhh: iHorarioAtencion = phh[dayName.toLowerCase()] as iHorarioAtencion;
                    console.log(dayName, day, dhh)
                    let firsthour: number = parseInt(dhh.start.split(':')[0])
                    let lastHour: number = parseInt(dhh.end.split(':')[0])
                    let first: Date = addHours(startOfDay(new Date(day)), firsthour)
                    let last: Date = addHours(startOfDay(new Date(day)), lastHour)
                    let newApDates = this.findAvailableAppointmentInDay(today, first, last, appointments, appDuration)
                    // console.log("new appointment dates", newApDates)
                    if (newApDates) {
                        let newAppointment = this.setAppointment(newApDates[0], newApDates[1], profesional, speciality, patient)
                        console.log("new appointment dates", newAppointment)
                        resolve(newAppointment)
                        break
                    }
                }
                resolve(null)
            }

        })
    }
    private findAvailableAppointmentInDay(today: Date, first: Date, last: Date, appointments: Appointment[], appDuration: number): Date[] | boolean {
        let found = false
        let newApStart: Date = new Date(first)
        let newApEnd: Date = addMinutes(new Date(first), appDuration)
        // console.log("Turnos buscar", newApStart, newApEnd)
        console.log("--------------------------------")
        for (let index = 0; index < appointments.length; index++) {
            const ap = appointments[index];

            // console.log("today      ", today,)
            // console.log("ap.start   ", ap.start,)
            // console.log("newApStart ", newApStart)
            // console.log("ap.end     ", ap.end)
            console.log("first      ", first)
            console.log("last       ", last)
            // console.log("today < newApStart ", today < newApStart)
            // console.log("(first <= ap.start) ", (first <= ap.start))
            // console.log("(ap.end >= last) ", (ap.end >= last))
            if (today < newApStart) {
                if (first <= ap.start && ap.end >= last) {

                    console.log("ap.start   ", ap.start,)
                    console.log("ap.end     ", ap.end)
                    console.log("newApStart ", newApStart)
                    console.log("(ap.start < newApStart && newApStart < ap.end) ", (ap.start < newApStart && newApStart < ap.end))
                    console.log("(ap.start < newApEnd && newApEnd < ap.end) ", (ap.start < newApEnd && newApEnd < ap.end))
                    while (newApEnd < last) {
                        if ((ap.start < newApStart && newApStart < ap.end) || (ap.start < newApEnd && newApEnd < ap.end)) {
                            newApStart = addMinutes(newApStart, appDuration)
                            newApEnd = addMinutes(newApEnd, appDuration)
                            console.log("newApStart ", newApStart)
                        } else {
                            console.log("Turnos ENCONTRADO", newApStart, newApEnd)
                            found = true;
                            break;
                        }
                    }
                    if (found) break
                }
            }
        }
        if (found) {
            return [newApStart, newApEnd]
        } else {
            return found
        }
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
