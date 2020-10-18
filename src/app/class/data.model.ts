
export class Specialties {
    id: string;
    name:eUserTypes;
}
export enum eUserTypes{
    profesional = "Profesional",
    client = "Patient",
    admin = "Admin",
}
export class ClinicUser {
    uid: string;
    id: string;
    type:eUserTypes;
    name: string;
    lastname: string;
}
export class Profesional extends ClinicUser {
    specialty: string[];
    tiempoTurno: number; // 30m o mas
    horarios_atencion: number[]; //dentro del rango
    estaAceptado: boolean;
    valoracion: number; // 1 a 5 
}
export class Patient extends ClinicUser {
}
export class Admin extends ClinicUser {
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
    day_hour:number | Date
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