
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
    constructor(type: eUserTypes, name: string, lastname: string, picture: string, uid: string) {
        this.uid = uid
        this.type = type
        this.name = name
        this.lastname = lastname
        this.picture = picture
    }
    uid: string;
    id: string;
    type: eUserTypes;
    name: string;
    lastname: string;
    picture: string;
}
export class Profesional extends ClinicUser {
    constructor(type: eUserTypes, name: string, lastname: string, picture: string, specialty: string[] = [], uid: string = '', tiempoTurno: number = 30, horarios_atencion: number[] = [9, 18], estaAceptado: boolean = false, valoracion: number = null) {
        super(type, name, lastname, picture, uid)
        this.specialty = specialty
        this.tiempoTurno = tiempoTurno
        this.horarios_atencion = horarios_atencion
        this.estaAceptado = estaAceptado
        this.valoracion = valoracion
    }
    specialty: string[];
    tiempoTurno: number; // 30m o mas
    horarios_atencion: number[]; //dentro del rango
    estaAceptado: boolean;
    valoracion: number; // 1 a 5 
}
export class Patient extends ClinicUser {
    constructor(type: eUserTypes, name: string, lastname: string, picture: string, uid: string = '') {
        super(type, name, lastname, picture, uid)
    }
}
export class Admin extends ClinicUser {
    constructor(type: eUserTypes, name: string, lastname: string, picture: string, uid: string = '') {
        super(type, name, lastname, picture, uid)
    }
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
    nombre: string;
}
export enum eSpacesTypes {
    consultorio = "Consultorio",
    Laboratiorio = "Laboratiorio"
}
export class Appointment {
    id: string;
    type: eSpacesTypes
    profesional: string; // id
    specialty: string
    day_hour: number | Date
    duration: number; //dentro del siguiente rango (lu a vi 8:00 a 19:00 && sa 8:00 a 14:00) y con el tiempo que cargo el profesional para esa especialidad
    acceptance: boolean; //el profesional debe aceptar el turno (se avisa al cliente el resultado), puede cancelar la aceptacion
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