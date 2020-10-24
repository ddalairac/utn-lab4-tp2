
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin, ClinicUser, eUserTypes, Patient, Profesional, Specialties } from '../../../../class/data.model';
import { eCollections, iAuthError } from '../../../../class/firebase.model';
import { FbAuthService } from '../../../../services/fb-auth.service';
import { FbStorageService } from '../../../../services/fb-storage.service';
//para poder hacer las validaciones
//import { Validators, FormBuilder, FormControl, FormGroup} from '@angular/forms';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    constructor(private fbauthservice: FbAuthService, private router: Router, private fbsorageservice: FbStorageService) { }

    email = new FormControl('', [Validators.required, Validators.email]);
    pass = new FormControl('', [Validators.required, Validators.minLength(6)]);
    type = new FormControl('', [Validators.required]);
    name = new FormControl('', [Validators.required]);
    lastname = new FormControl('', [Validators.required]);
    specialty = new FormControl();
    picture = new FormControl();
    // tiempoTurno = new FormControl();
    // horarios_atencion = new FormControl();
    rememberMe = new FormControl(true);


    newUserForm = new FormGroup({ email: this.email, pass: this.pass })

    errorMensaje: string;

    specialtiesList: Specialties[] = []
    tytpesList: any[] = [
        // { value: eUserTypes.admin, viewValue: 'Administrador' },
        { value: eUserTypes.patient, viewValue: 'Paciente' },
        { value: eUserTypes.profesional, viewValue: 'Profesional' }
    ];
    // tiempoTurnoList:number[] = [30,60,90,120]

    getEmailErrorMessage() {
        if (this.email.hasError('required')) return 'Es un campo obligatorio';
        if (this.email.hasError('email')) return 'Mail invalido';
        return '';
    }

    getClaveErrorMessage() {
        if (this.pass.hasError('required')) return 'Es un campo obligatorio';
        if (this.pass.hasError('minlength')) return 'Debe tener 6 caracteres como mínimo';
        return '';
    }

    ngOnInit() {
        this.fbsorageservice.readAll(eCollections.specialties).then((list) => this.specialtiesList = list)
    }
    private isValid(): boolean {
        if (this.email.invalid || this.pass.invalid || this.type.invalid || this.name.invalid || this.lastname.invalid) {
            return false;
        }
        return true;
    }
    onSubmit() {
        this.errorMensaje = ""
        let userInfo: ClinicUser;
        if (this.isValid()) {
            switch (this.type.value) {
                case eUserTypes.admin:
                    userInfo = new Admin(this.type.value,this.email.value, this.name.value, this.lastname.value, this.picture.value);
                    break;
                case eUserTypes.patient:
                    userInfo = new Patient(this.type.value,this.email.value, this.name.value, this.lastname.value, this.picture.value);
                    break;
                case eUserTypes.profesional:
                    userInfo = new Profesional(this.type.value,this.email.value, this.name.value, this.lastname.value, this.picture.value, this.specialty.value);
                    break;
            }
            this.fbauthservice.register(this.email.value, this.pass.value, this.rememberMe.value, userInfo)
                .then(() => {
                    console.log("register")
                }).catch((error: iAuthError) => {
                    this.errorMensaje = error.message
                })
        }
    }


}


