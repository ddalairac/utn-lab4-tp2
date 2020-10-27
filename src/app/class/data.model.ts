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
    hourStartMon: string = '08:00';
    hourEndMon: string = '19:00';
    hourStartTue: string = '08:00';
    hourEndTue: string = '19:00';
    hourStartWed: string = '08:00';
    hourEndWed: string = '19:00';
    hourStartThu: string = '08:00';
    hourEndThu: string = '19:00';
    hourStartFri: string = '08:00';
    hourEndFri: string = '19:00';
    hourStartSat: string = '08:00';
    hourEndSat: string = '14:00';
    hourMonCK:boolean = false;
    hourTueCK:boolean = false;
    hourWedCK:boolean = false;
    hourThuCK:boolean = false;
    hourFriCK:boolean = false;
    hourSatCK:boolean = false;
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
    id: string;
    profesional: string; // id profesional
    patient: string; // id paciente
    specialty: string; // la del turno 
    date: number; // la del turno
    age: number;
    body_temperature: number;
    blood_pressure: number[];
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
    start: string
    end: string
    patient: Patient
    acceptance: boolean; //el profesional debe aceptar el turno (se avisa al cliente el resultado), puede cancelar la aceptacion
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