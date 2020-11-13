import { CalendarEvent } from 'angular-calendar';


export class Specialties {
    id: string;
    name: string;
}
export enum eUserTypes {
    profesional = "Profesional",
    patient = "Patient",
    admin = "Admin",
}
export abstract class ClinicUser {
    constructor(type: eUserTypes, mail: string, name: string, lastname: string, picture: string, uid: string) {
        this.uid = uid
        this.mail = mail
        this.type = type
        this.name = name
        this.lastname = lastname
        this.picture = picture
    }
    uid: string;
    id: string;
    mail: string;
    type: eUserTypes;
    name: string;
    lastname: string;
    picture: string;
}
export class Profesional extends ClinicUser {
    constructor(type: eUserTypes, mail: string, name: string, lastname: string, picture: string = '', specialty: string[] = [], uid: string = '', tiempoTurno: number = 30, horarios_atencion: HorariosAtencion = new HorariosAtencion(), estaAceptado: boolean = false, valoracion: number = null) {
        super(type, mail, name, lastname, picture, uid)
        this.specialty = specialty
        this.tiempoTurno = tiempoTurno
        this.horarios_atencion = horarios_atencion
        this.estaAceptado = estaAceptado
        this.valoracion = valoracion
    }
    specialty: string[];
    tiempoTurno: number; // 30m o mas
    horarios_atencion: HorariosAtencion; //dentro del rango
    estaAceptado: boolean;
    valoracion: number; // 1 a 5 
}
export class Patient extends ClinicUser {
    constructor(type: eUserTypes, mail: string, name: string, lastname: string, picture: string = '', uid: string = '') {
        super(type, mail, name, lastname, picture, uid)
    }
}
export class Admin extends ClinicUser {
    constructor(type: eUserTypes, mail: string, name: string, lastname: string, picture: string = '', uid: string = '') {
        super(type, mail, name, lastname, picture, uid)
    }
}
export class HorariosAtencion {
    mon: iHorarioAtencion = {
        start: '08:00',
        end: '19:00',
        active: false
    }
    tue: iHorarioAtencion = {
        start: '08:00',
        end: '19:00',
        active: false
    }
    wed: iHorarioAtencion = {
        start: '08:00',
        end: '19:00',
        active: false
    }
    thu: iHorarioAtencion = {
        start: '08:00',
        end: '19:00',
        active: false
    }
    fri: iHorarioAtencion = {
        start: '08:00',
        end: '19:00',
        active: false
    }
    sat: iHorarioAtencion = {
        start: '08:00',
        end: '14:00',
        active: false
    }
}
export interface iHorarioAtencion {
    start: string;
    end: string;
    active: boolean;
}

export class AttentionSurvey {
    id: string;
    profesional: string; //id profesional
    specialty: string; // (una del array de profesional)
    puntuacion: number; // 1 a 5
    Comentarios: string;
}

export class AttentionSpaces {
    id: string;
    type: eSpacesTypes
    name: string;
}
export enum eSpacesTypes {
    office = "Office",
    laboratory = "Laboratory"
}
export class ClinicHistory {
    id?: string;
    profesional: Profesional; 
    patient: Patient; 
    specialty: string; 
    date: Date | number; 
    age: number;
    body_temperature: number;
    blood_pressure: string;
    extra_data: ExtraData[]
    text: string;
}
export class ExtraData {
    key: string;
    value: string;
}

export class Appointment {
    id?: string;
    space: eSpacesTypes
    spaceName: string
    profesional: Profesional; // id
    specialty: string
    start: Date | number
    end: Date | number
    patient: Patient
    acceptance: boolean; //el profesional debe aceptar el turno (se avisa al cliente el resultado), puede cancelar la aceptacion
    clinicHistoryCompleted:boolean;
}
// export interface  AppointmentEvent extends Appointment, CalendarEvent{
//     start: Date;
//     end?: Date;
//     title: string;
//     color?: EventColor;
//     actions?: EventAction[];
//     allDay?: boolean;
//     cssClass?: string;
// }

export interface iModalData {
    event: CalendarEvent<Appointment>;
    action: string;
    selectProfesional?: Profesional;
    selectSpecialty?: Specialties;
}