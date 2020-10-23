import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin, Patient, Profesional, Specialties } from '../../../../class/data.model';
import { eCollections } from '../../../../class/firebase.model';
import { FbStorageService } from '../../../../services/fb-storage.service';
import { iTableAction, iTableEvent } from '../../../cross/table/table.model';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


    constructor(private fbsorageservice: FbStorageService, private router:Router) { }

    ngOnInit(): void {
        this.fbsorageservice.readAll(eCollections.users).then((list: Array<Profesional | Patient | Admin | null>) => { this.users = list; console.log(list) })
    }
    users: Array<Profesional | Patient | Admin | null> = []
    hideCols: string[] = ['id', 'uid', 'specialty', 'tiempoTurno', 'horarios_atencion', 'estaAceptado', 'valoracion']

    actions: iTableAction[] = [
        {
            description: "ver",
            icon: "fas fa-eye",
            event: "ver"
        }, {
            description: "editar",
            icon: "fas fa-edit",
            event: "editar"
        }, {
            description: "borrar",
            icon: "fas fa-times",
            event: "borrar"
        }
    ]
    onTableEvent(event: iTableEvent) {
        console.log("event", event)
    }
    onNewUser(){
        this.router.navigateByUrl('/admins/user-new')
    }
}
