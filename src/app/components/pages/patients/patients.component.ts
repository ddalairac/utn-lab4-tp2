import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
    menu = [
                {
            label: "Calendario Turnos",
            path: "/patients/apointmentList"
        },
        {
            label: "Nuevo turno",
            path: "/patients/apointmentNew"
        },
        {
            label: "Encuesta",
            path: "/patients/apointmentSurvey"
        },
    ]

}
