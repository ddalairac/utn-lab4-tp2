import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AnimateGallery } from '../../../../class/animations.component';
import { eAuthEstado, iAuthError } from '../../../../class/firebase.model';
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
    usuario: string;
    clave: string;
    invalidUsuario: boolean
    invalidClave: boolean
    errorMensaje: string
    rememberMe: boolean = true

    // recuperar: boolean

    ngOnInit() {
        if (window.localStorage.getItem("user")) {
            this.usuario = JSON.parse(window.localStorage.getItem("user"));
            this.clave = JSON.parse(window.localStorage.getItem("pass"));
        }
    }
    onGuest() {
        this.usuario = "guest@gmail.com"
        this.clave = "123456"
    }
    onLogin() {
        this.errorMensaje = ""
        this.invalidUsuario = false
        this.invalidClave = false
        let isvalid: eAuthEstado = this.fbauthservice.validarDatos(this.usuario, this.clave)

        if (isvalid == eAuthEstado.valid) {
            this.fbauthservice.singIn(this.usuario, this.clave, this.rememberMe)
                .then(() => {
                    this.router.navigateByUrl('home');
                }).catch((error: iAuthError) => {
                    // console.log("Error Login:", error)
                    this.errorMensaje = error.message
                })

        } else {
            this.errorMensaje = isvalid;
            switch (isvalid) {
                case eAuthEstado.userNull:
                case eAuthEstado.userInvalid:
                    this.invalidUsuario = true;
                    break
                case eAuthEstado.passNull:
                case eAuthEstado.passInvalid:
                    this.invalidClave = true;
                    break
            }
        }
    }

    onRecover() {
        this.fbauthservice.recoverPass(this.usuario)
        this._snackBar.open("Se envio el mail de recuperio a " + this.usuario, "ok", {
            duration: 2000,
        });
        // this.recuperar = false;
        this.backFromRecover()
    }

    state: string
    state2: string
    goToRecover() {
        // this.recuperar = true
        this.state = "slideOutLeft"
        this.state2 = "slideInRight"
    }
    backFromRecover() {
        // this.recuperar = false
        this.state = "slideInLeft"
        this.state2 = "slideOutRight"
    }

}
