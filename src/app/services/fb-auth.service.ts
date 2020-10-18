import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Profesional, Admin, Patient } from '../class/data.model';
import { iAuthError, eAuthEstado, eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class FbAuthService {

    private userMail: string
    private fbUserData: firebase.User
    private userInfo//: Profesional | Patient | Admin

    isLogged$ = new Subject<boolean>();

    constructor(
        private fireAuth: AngularFireAuth,
        private router: Router,
        private loader: LoaderService,
        private fbsorageservice: FbStorageService
    ) {
        this.fireAuth.authState.subscribe(async (fbuser:firebase.User) => {
            if (fbuser) {
                this.fbUserData = fbuser;
                localStorage.setItem('userMail', JSON.stringify(this.userMail));
                this.isLogged$.next(true);
                this.userInfo = await this.getUserInfo(fbuser.uid)
            } else {
                // localStorage.setItem('userMail', null);
                this.isLogged$.next(false);
                this.userInfo = null
            }
            console.log("user: ", this.userMail)
            console.log("fbUserData: ", this.fbUserData)
            console.log("isLogged$: ", this.isLogged$)
            console.log("userInfo: ", this.userInfo)
        })
    }




    checkfbUserData() {
        this.fireAuth.currentUser.then(data => {
            this.fbUserData = data
            console.log("fbUserData", this.fbUserData)
        })
    }
    recoverPass(email) {
        this.fireAuth.sendPasswordResetEmail(email).then(function () {
            // console.log("Recover Email sent")
        }).catch(function (error) {
            // console.log("Recover Email error",error)
        });
    }

    public async register(usuario, clave, rememberMe) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.createUserWithEmailAndPassword(usuario, clave)
                .then(async () => {
                    await this.saveAuthInData(usuario, clave, rememberMe, "register");
                    this.loader.hide();
                    resolve(true)
                }).catch((error: iAuthError) => {
                    // console.log("Error Register:", error)
                    this.loader.hide();
                    reject(error)
                })
        })
    }

    public async singIn(usuario, clave, rememberMe) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.signInWithEmailAndPassword(usuario, clave).then(
                async () => {
                    await this.saveAuthInData(usuario, clave, rememberMe, "login");
                    this.loader.hide();
                    this.checkfbUserData()
                    resolve(true)
                }).catch(
                    (error: iAuthError) => {
                        // console.log("Error Login:", error)
                        this.loader.hide();
                        reject(error)
                    }
                )
        });
    }
    private async getUserInfo(uid) {
        return this.fbsorageservice.getUserInfoByUid(uid)
        // .then((userInfo) => { 
        //     this.userInfo = userInfo //as  Profesional | Patient | Admin;
        //     console.log("uid: ", uid)
        //     console.log("userInfo: ", this.userInfo)
        // })
    }

    public async singOut() {
        this.loader.show();
        await this.deleteAuthOutData()
        await this.fireAuth.signOut();

        this.loader.hide();
        // this.isLogged$.next(false);
        this.router.navigateByUrl('/authuser');
    }

    public getUserId(): string {
        return (this.userMail) ? this.userMail : "nullUser";
    }


    public validarDatos(usuario: string, clave: string): eAuthEstado {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (usuario == '') {
            return eAuthEstado.userNull
        }
        if (!re.test(usuario)) {
            return eAuthEstado.userInvalid
        }
        if (clave == '') {
            return eAuthEstado.passNull
        }
        if (clave.length < 6) {
            return eAuthEstado.passInvalid
        }
        return eAuthEstado.valid
    }

    private async deleteAuthOutData() {
        setTimeout(() => {
            this.userMail = null
            return true
        }, 0);
    }

    private async saveAuthInData(usuario, clave, rememberMe, type) {
        this.userMail = usuario;
        if (rememberMe) {
            window.localStorage.setItem("user", JSON.stringify(usuario));
            window.localStorage.setItem("pass", JSON.stringify(clave));
        } else {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("pass");
        }
        return true
    }
}
