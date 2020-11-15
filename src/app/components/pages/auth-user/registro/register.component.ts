
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Admin, ClinicUser, eUserTypes, Patient, Profesional, Specialties } from '../../../../class/data.model';
import { eCollections, iAuthError } from '../../../../class/firebase.model';
import { CaptchaService } from '../../../../services/captcha.service';
import { FbAuthService } from '../../../../services/fb-auth.service';
import { FbDBService } from '../../../../services/fb-db.service';
//para poder hacer las validaciones
//import { Validators, FormBuilder, FormControl, FormGroup} from '@angular/forms';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    constructor(private fbauthservice: FbAuthService,
        private router: Router,
        private fbDBservice: FbDBService,
        private captchaService: CaptchaService
    ) { }

    email = new FormControl('', [Validators.required, Validators.email]);
    pass = new FormControl('', [Validators.required, Validators.minLength(6)]);
    type = new FormControl('', [Validators.required]);
    name = new FormControl('', [Validators.required]);
    lastname = new FormControl('', [Validators.required]);
    specialty = new FormControl();
    picture = new FormControl();
    captcha = new FormControl(undefined, [Validators.required]);
    rememberMe = new FormControl(true);


    newUserForm = new FormGroup({ email: this.email, pass: this.pass }) //! arreglar con todos los atributos

    errorMensaje: string;
    captchaError:boolean

    specialtiesList: Specialties[] = []
    tytpesList: any[] = [
        // { value: eUserTypes.admin, viewValue: 'Administrador' },
        { value: eUserTypes.patient, viewValue: 'Paciente' },
        { value: eUserTypes.profesional, viewValue: 'Profesional' }
    ];
    // tiempoTurnoList:number[] = [30,60,90,120]

    reCaptchaKey: string;

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
        this.reCaptchaKey = environment.reCAPTCHAWeb;
        this.fbDBservice.readAll(eCollections.specialties).then((list) => this.specialtiesList = list)
    }
    private isValid(): boolean {
        let res:boolean = true
        if (this.email.invalid || this.pass.invalid || this.type.invalid || this.name.invalid || this.lastname.invalid) {
            res = false;
        }
        if (this.captcha.value == undefined) {
            this.captchaError = true
            res = false;
        } else {
            this.captchaError = false
        }
        console.log("captchaError",this.captchaError,"value",this.captcha.value)
        return res;
    }
    onSubmit() {
        this.errorMensaje = ""
        let userInfo: ClinicUser;
        if (this.isValid()) {
            switch (this.type.value) {
                case eUserTypes.admin:
                    userInfo = new Admin(this.email.value,this.pass.value, this.name.value, this.lastname.value);
                    break;
                case eUserTypes.patient:
                    userInfo = new Patient(this.email.value,this.pass.value, this.name.value, this.lastname.value);
                    break;
                case eUserTypes.profesional:
                    userInfo = new Profesional(this.email.value,this.pass.value, this.name.value, this.lastname.value, this.specialty.value);
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

    public onReCaptcha(token: string) {
        // console.log(this.captcha)
        // console.log(`Resolved captcha with response: ${token}`);
        let value: boolean = this.captchaService.validate(token);
        this.captcha.setValue(value)
        this.isValid()
    }


}


