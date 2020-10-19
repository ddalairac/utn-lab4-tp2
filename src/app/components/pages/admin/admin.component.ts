import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
    // menu = [
    //     {
    //         label: "Calendario Turno",
    //         path: "/admins/profesionalsList"
    //     },
    //     {
    //         label: "Especialidades",
    //         path: "/admins/specialtiesList"
    //     },
    // ]
}
