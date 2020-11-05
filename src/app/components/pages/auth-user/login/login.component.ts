import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnimateGallery } from '../../../../class/animations.component';
import { FbAuthService } from '../../../../services/fb-auth.service';

// import { TimerObservable } from "rxjs/observable/TimerObservable";
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [AnimateGallery]
})
export class LoginComponent implements OnInit {

    constructor(private fbauthservice: FbAuthService, private router: Router, private _snackBar: MatSnackBar) { }

    email = new FormControl('', [Validators.required, Validators.email]);
    pass = new FormControl('', [Validators.required, Validators.minLength(6)]);
    rememberMe = new FormControl(true);
    errorMensaje: string;


    public getEmailErrorMessage() {
        if (this.email.hasError('required')) return 'Es un campo obligatorio';
        if (this.email.hasError('email')) return 'Mail invalido';
        return '';
    }

    public getClaveErrorMessage() {
        if (this.pass.hasError('required')) return 'Es un campo obligatorio';
        if (this.pass.hasError('minlength')) return 'Debe tener 6 caracteres como mínimo';
        return '';
    }






    ngOnInit() {
        if (window.localStorage.getItem("user")) {
            this.email.setValue(JSON.parse(window.localStorage.getItem("user")));
            this.pass.setValue(JSON.parse(window.localStorage.getItem("pass")));
        }
    }
    onGuest() {
        this.email.setValue("guest@gmail.com")
        this.pass.setValue("123456")
    }
    loginPaciente() {
        this.email.setValue('paciente@gmail.com')
        this.pass.setValue('123456')
    }
    loginProfesional() {
        this.email.setValue('profesional@gmail.com')
        this.pass.setValue('123456')
    }
    loginAdmin() {
        this.email.setValue('admin@gmail.com')
        this.pass.setValue('123456')
    }


    private isValid(): boolean {
        if (this.email.invalid || this.pass.invalid) {
            return false;
        }
        return true;
    }
    onLogin() {
        this.errorMensaje = ""

        if (this.isValid()) {
            this.fbauthservice.singIn(this.email.value, this.pass.value, this.rememberMe.value)
                .then(() => {
                    console.log("singIn")
                }).catch((error) => {
                    this.errorMensaje = error.message
                })
        }
    }

    onRecover() {
        this.fbauthservice.recoverPass(this.email.value)
        this._snackBar.open("Se envio el mail de recuperio a " + this.email.value, "ok", {
            duration: 2000,
        });
        this.backFromRecover()
    }

    state: string
    state2: string
    goToRecover() {
        this.state = "slideOutLeft"
        this.state2 = "slideInRight"
    }
    backFromRecover() {
        this.state = "slideInLeft"
        this.state2 = "slideOutRight"
    }


}
