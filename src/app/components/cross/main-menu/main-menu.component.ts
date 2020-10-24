import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Admin, eUserTypes, Patient, Profesional } from '../../../class/data.model';
import { FbAuthService } from '../../../services/fb-auth.service';
import { iMenu } from '../menu/menu.component';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

    navLinks: iMenu[];
    constructor(
        private fbauthservice: FbAuthService, 
        // private route: ActivatedRoute, 
        private router: Router) { }

    public isLogged$: Subject<boolean>;
    public userInfo: Profesional | Patient | Admin | null;
    // public userType: eUserTypes;

    ngOnInit() {
        this.isLogged$ = this.fbauthservice.isLogged$;

        this.fbauthservice.userInfo$.subscribe(
            (info: Profesional | Patient | Admin | null) => {
                // this.userType = (info && info.type) ? info.type : null;
                this.userInfo = info;
                if (info && info.type) {
                    switch (info.type) {
                        case eUserTypes.admin:
                            this.navLinks = this.menuAdmins
                            break;
                        case eUserTypes.patient:
                            this.navLinks = this.menuPatients
                            break;
                        case eUserTypes.profesional:
                            this.navLinks = this.menuProfesionals
                            break;
                    }
                } else { this.navLinks = []; }
            }
        )
    }
    goToSection(url) {
        this.router.navigateByUrl(url);
    }
    onSingOut() {
        this.fbauthservice.singOut();
    }
    onProfile(){
        this.router.navigateByUrl('profile')
    }

    private menuAdmins = [
        {
            label: "Profesionales",
            path: "/admins/profesionalsList"
        },
        {
            label: "Usuarios",
            path: "/admins/users"
        },
        {
            label: "Especialidades",
            path: "/admins/specialtiesList"
        }
    ]
    private menuPatients = [
        {
            label: "Turnos",
            path: "/patients/appointments"
        },
        {
            label: "Encuesta",
            path: "/patients/appointmentSurvey"
        }
    ]
    private menuProfesionals = [
        {
            label: "Calendario Turnos",
            path: "/profesionals/appointments"
        },
        {
            label: "Historias clinicas",
            path: "/profesionals/clinicHistory"
        }
    ]
}
