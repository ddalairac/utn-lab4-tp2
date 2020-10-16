import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-profecionals',
    templateUrl: './profecionals.component.html',
    styleUrls: ['./profecionals.component.scss']
})
export class ProfecionalsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
    menu = [
        {
            label: "Calendario Turnos",
            path: "/profesionals/apointmentList"
        },
        {
            label: "Historias clinicas",
            path: "/profesionals/clinicHistory"
        }
    ]

}
