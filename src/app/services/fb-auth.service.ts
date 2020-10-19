import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Profesional, Admin, Patient, ClinicUser } from '../class/data.model';
import { iAuthError, eAuthEstado, eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class FbAuthService {

    private userMail: string
    // public userInfo: Profesional | Patient | Admin
    public userInfo$: Subject<Profesional | Patient | Admin | null> = new Subject<Profesional | Patient | Admin | null>();
    public isLogged$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private fireAuth: AngularFireAuth,
        private router: Router,
        private loader: LoaderService,
        private fbsorageservice: FbStorageService
    ) {
        this.fireAuth.authState.subscribe(async (fbuser: firebase.User) => {
            if (fbuser) {
                localStorage.setItem('userMail', JSON.stringify(this.userMail));
                this.isLogged$.next(true);
                this.userInfo$.next(await this.fbsorageservice.getUserInfoByUid(fbuser.uid))
                // this.userInfo = await this.fbsorageservice.getUserInfoByUid(fbuser.uid)
            } else {
                this.isLogged$.next(false);
                this.userInfo$.next(null);
                // this.userInfo = null;
                this.userMail = null;
            }
            console.log("user: ", this.userMail)
            // console.log("fbUserData: ", this.fbUserData)
            // console.log("isLogged$: ", this.isLogged$)
            console.log("userInfo: ", this.userInfo$)
        })
    }

    // public async checkfbUserData(): Promise<firebase.User> {
    //     let fbUser: firebase.User;
    //     await this.fireAuth.currentUser.then((data: firebase.User) => {
    //         fbUser = data
    //         console.log("firebase.User: ", fbUser)
    //     })
    //     return fbUser;
    // }

    public recoverPass(email) {
        this.fireAuth.sendPasswordResetEmail(email).then(function () {
            // console.log("Recover Email sent")
        }).catch(function (error) {
            // console.log("Recover Email error",error)
        });
    }

    public async register(usuario: string, clave: string, rememberMe: boolean, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.createUserWithEmailAndPassword(usuario, clave)
                .then(async (res: firebase.auth.UserCredential) => {
                    // console.log("register uid: ",res.user.uid)
                    await this.createUserInfoRegiuster(res.user.uid, userData)
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
    private async createUserInfoRegiuster(uid:string, userData: ClinicUser){
        userData.uid = uid;
        this.fbsorageservice.create(eCollections.users,userData)
    }

    public async singIn(usuario, clave, rememberMe) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.signInWithEmailAndPassword(usuario, clave).then(
                async () => {
                    await this.saveAuthInData(usuario, clave, rememberMe, "login");
                    resolve(true)
                }).catch(
                    (error: iAuthError) => {
                        // console.log("Error Login:", error)
                        reject(error)
                    }
                ).finally(() => this.loader.hide())
        });
    }

    public async singOut() {
        this.loader.show();
        await this.fireAuth.signOut();
        this.loader.hide();
        this.router.navigateByUrl('/authuser');
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
