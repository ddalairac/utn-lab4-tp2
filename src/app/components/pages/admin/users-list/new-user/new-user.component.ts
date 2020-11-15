import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Specialties, eUserTypes, ClinicUser, Admin, Patient, Profesional } from '../../../../../class/data.model';
import { eCollections, iAuthError } from '../../../../../class/firebase.model';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { FbDBService } from '../../../../../services/fb-db.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  
    constructor(private fbauthservice: FbAuthService, private router: Router, private fbDBservice: FbDBService) { }

    email = new FormControl('', [Validators.required, Validators.email]);
    pass = new FormControl('', [Validators.required, Validators.minLength(6)]);
    type = new FormControl('', [Validators.required]);
    name = new FormControl('', [Validators.required]);
    lastname = new FormControl('', [Validators.required]);
    specialty = new FormControl();
    picture = new FormControl();


    newUserForm = new FormGroup({ email: this.email, pass: this.pass })

    errorMensaje: string;

    specialtiesList: Specialties[] = []
    tytpesList: any[] = [
        { value: eUserTypes.admin, viewValue: 'Administrador' },
        { value: eUserTypes.patient, viewValue: 'Paciente' },
        { value: eUserTypes.profesional, viewValue: 'Profesional' }
    ];

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
        this.fbDBservice.readAll(eCollections.specialties).then((list) => this.specialtiesList = list)
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
                    userInfo = new Admin(this.email.value,this.pass.value, this.name.value, this.lastname.value, this.picture.value);
                    break;
                case eUserTypes.patient:
                    userInfo = new Patient(this.email.value,this.pass.value, this.name.value, this.lastname.value, this.picture.value);
                    break;
                case eUserTypes.profesional:
                    userInfo = new Profesional(this.email.value,this.pass.value, this.name.value, this.lastname.value, this.picture.value, this.specialty.value);
                    break;
            }
            this.fbauthservice.registerNewUser(this.email.value, this.pass.value,  userInfo)
                .then(() => {
                    console.log("register new user")
                }).catch((error: iAuthError) => {
                    this.errorMensaje = error.message
                })
        }
    }

}
