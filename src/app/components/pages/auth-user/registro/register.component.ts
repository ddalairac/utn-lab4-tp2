
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { eAuthEstado, iAuthError } from '../../../../class/firebase.model';
import { FbAuthService } from '../../../../services/fb-auth.service';
//para poder hacer las validaciones
//import { Validators, FormBuilder, FormControl, FormGroup} from '@angular/forms';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    constructor(private fbauthservice: FbAuthService, private router: Router) { }
    usuario: string;
    clave: string;
    invalidUsuario: boolean
    invalidClave: boolean
    errorMensaje: string
    rememberMe: boolean

    ngOnInit() {
        this.usuario = ""
        this.clave = ""
    }
    onRegistrar() {
        this.errorMensaje = ""
        this.invalidUsuario = false
        this.invalidClave = false
        let isvalid: eAuthEstado = this.fbauthservice.validarDatos(this.usuario, this.clave)

        if (isvalid == eAuthEstado.valid) {
            this.fbauthservice.register(this.usuario, this.clave, this.rememberMe)
                .then(() => {
                    this.router.navigateByUrl('home');
                }).catch((error: iAuthError) => {
                    // console.log("Error register:", error)
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


}


