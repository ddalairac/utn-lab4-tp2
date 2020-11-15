import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Admin, ClinicUser, eUserTypes, Patient, Profesional, Specialties } from '../../../../class/data.model';
import { eCollections } from '../../../../class/firebase.model';
import { FbAuthService } from '../../../../services/fb-auth.service';
import { FbDBService } from '../../../../services/fb-db.service';
import { iTableAction, iTableEvent } from '../../../cross/table/table.model';
import { iTableCol } from '../../../cross/table2/table2.model';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

    // date:Date = new Date(Date.now())
    // date:Date = new Date('1-1-2020')
    constructor(private fbDBservice: FbDBService, private fbauthservice: FbAuthService, private router: Router) { }

    ngOnInit(): void {
        this.getUsers()
    }
    private getUsers() {
        this.fbDBservice.readAll(eCollections.users).then((list: ClinicUser[]) => {
            // this.users = list;
            this.tablelist = this.setList(list)
            this.onFilter()
        })

    }
    tablelist: iUserslist[] = []
    tablelistFiltered: iUserslist[] = []
    hideCols: string[] = ['meta']
    filtroTexto: string = ''
    filtroTipo: string = ''

    tytpesList: any[] = [
        { value: '', viewValue: 'Todos' },
        { value: eUserTypes.admin, viewValue: 'Administrador' },
        { value: eUserTypes.patient, viewValue: 'Paciente' },
        { value: eUserTypes.profesional, viewValue: 'Profesional' }
    ];
    // users: ClinicUser[] = [] //Array<Profesional | Patient | Admin | null> = []
    // tableCols: iTableCol[] = [{ key: 'picture', translate: 'Foto' },{ key: 'lastname', translate: 'apellido' }, { key: 'name', translate: 'nombre' }, { key: 'mail', translate: 'Mail' },  { key: 'type', translate: 'Tipo' }]

    actions: iTableAction[] = [
        {
            //     description: "ver",
            //     icon: "fas fa-eye",
            //     event: "ver"
            // }, {
            //     description: "editar",
            //     icon: "fas fa-edit",
            //     event: "editar"
            // }, {
            description: "borrar",
            icon: "fas fa-times",
            event: "borrar"
        }
    ]
    public onTableEvent(event: iTableEvent) {
        console.log("event", event)
        if (event.action == "borrar") {
            // console.log('Borrar usuario')
            this.fbauthservice.removeUser(event.obj.meta).then(() => this.getUsers())
        }
    }
    // public onSelect(user: ClinicUser){
    //     console.log("user", user)
    // }
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
                // apellido: item.lastname,
                nombre: item.name + ', ' + item.lastname,
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
    public onFilter() {
        this.tablelistFiltered = this.tablelist.filter((e) => {
            // por texto
            if (this.filtroTexto) {
                let found: boolean = false
                for (let attr in e) {
                    let value = e[attr]
                    if (typeof value == 'string' && value) {
                        if (!value.toLowerCase().includes('.jpg') && !value.toLowerCase().includes('.png') && !value.toLowerCase().includes('.jpeg')) {
                            if (value.toLowerCase().includes(this.filtroTexto.toLowerCase())) { found = true }
                        }
                    }
                }
                return found
            }
            if (this.filtroTipo) {
                console.log(e.meta.type + '==' + this.filtroTipo, (e.meta.type == this.filtroTipo))
                return e.meta.type == this.filtroTipo
            }
            return true
        })
    }
}

interface iUserslist {
    // apellido: string;
    nombre: string;
    mail: string;
    foto: string;
    tipo: string;
    meta: any
}