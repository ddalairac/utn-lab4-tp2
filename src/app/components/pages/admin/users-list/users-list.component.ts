import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin, ClinicUser, eUserTypes, Patient, Profesional, Specialties } from '../../../../class/data.model';
import { eCollections } from '../../../../class/firebase.model';
import { FbStorageService } from '../../../../services/fb-storage.service';
import { iTableAction, iTableEvent } from '../../../cross/table/table.model';
import { iTableCol } from '../../../cross/table2/table2.model';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


    constructor(private fbsorageservice: FbStorageService, private router: Router) { }

    ngOnInit(): void {
        this.fbsorageservice.readAll(eCollections.users).then((list: ClinicUser[]) => {
            // this.users = list;
            this.tablelist =  this.setList(list)
        })
    }
    tablelist: iUserslist[] = []
    hideCols: string[] = ['meta']
    // users: ClinicUser[] = [] //Array<Profesional | Patient | Admin | null> = []
    // tableCols: iTableCol[] = [{ key: 'picture', translate: 'Foto' },{ key: 'lastname', translate: 'apellido' }, { key: 'name', translate: 'nombre' }, { key: 'mail', translate: 'Mail' },  { key: 'type', translate: 'Tipo' }]

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
    public onTableEvent(event: iTableEvent) {
        console.log("event", event)
    }
    public onNewUser() {
        this.router.navigateByUrl('/admins/user-new')
    }

    private setList(list: ClinicUser[]): iUserslist[] {
        let tablelist: iUserslist[] = []
        list.forEach((item: ClinicUser) => {
            let type = ''
            if (item.type == eUserTypes.admin) { type = "Administrador" }
            if (item.type == eUserTypes.patient) { type = "Paciente" }
            if (item.type == eUserTypes.profesional) { type = "Profesional" }

            let listItem: iUserslist = {
                apellido: item.lastname,
                nombre: item.name,
                mail: item.mail,
                foto: item.picture,
                tipo: type,
                meta: item
            }
            tablelist.push(listItem)
        })
        // console.log("tablelist",tablelist)
        return tablelist
    }
}

interface iUserslist {
    apellido: string;
    nombre: string;
    mail: string;
    foto: string;
    tipo: string;
    meta: any
}