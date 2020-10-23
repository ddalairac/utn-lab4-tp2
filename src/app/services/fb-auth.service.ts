import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Profesional, Admin, Patient, ClinicUser, eUserTypes } from '../class/data.model';
import { iAuthError, eAuthEstado, eCollections } from '../class/firebase.model';
import { FbStorageService } from './fb-storage.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class FbAuthService {

    public type: eUserTypes | null = null
    // public userMail$: BehaviorSubject<string | null>;
    public isLogged$: BehaviorSubject<boolean>;
    public userInfo$: BehaviorSubject<Profesional | Patient | Admin | null>;
    public userFB$: BehaviorSubject<firebase.User | null>;

    constructor(
        private fireAuth: AngularFireAuth,
        private router: Router,
        private loader: LoaderService,
        private fbsorageservice: FbStorageService
    ) {
        // this.userMail$ = new BehaviorSubject(null)
        this.userInfo$ = new BehaviorSubject(null);
        this.isLogged$ = new BehaviorSubject(false);
        this.userFB$ = new BehaviorSubject(null);

        this.fireAuth.authState.subscribe(async (userFB: firebase.User) => {
            if (userFB) {
                this.userFB$.next(userFB)
                this.fbsorageservice.getUserInfoByUid(userFB.uid).then((user: ClinicUser) => {
                    this.type = user.type
                    this.userInfo$.next(user)
                    this.isLogged$.next(true);
                    
                    this.router.navigateByUrl('home');
                })
            } else {
                // this.userMail$.next(null);
                this.userFB$.next(null)
                this.userInfo$.next(null);
                this.isLogged$.next(false);
                this.type = null;
                
                this.router.navigateByUrl('authuser');
            }
        })
        // // this.userMail$.subscribe(data => console.log("userMail: ", data))
        // this.userFB$.subscribe((data) => {console.log("userFB: ", data); if(data)console.log("userFB email: ", data.email)})
        // this.userInfo$.subscribe(data => console.log("userInfo: ", data))
        // this.isLogged$.subscribe(data => console.log("isLogged: ", data))
    }

    public recoverPass(email) {
        this.fireAuth.sendPasswordResetEmail(email).then(function () {
            // console.log("Recover Email sent")
        }).catch(function (error) {
            // console.log("Recover Email error",error)
        });
    }
    public async SendVerificationMail() {
        (await this.fireAuth.currentUser).sendEmailVerification().then(() => {
            console.log('email sent');
        });
    }

    public async registerNewUser(usuario: string, clave: string, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            
            this.fireAuth.createUserWithEmailAndPassword(usuario, clave)
                .then((res: firebase.auth.UserCredential) => {
                    this.createUserInfoRegiuster(res.user.uid, userData)
                    resolve(true)
                }).catch((error: iAuthError) => {
                    reject(error)
                }).finally(() => this.loader.hide())
        })
    }

    public async register(usuario: string, clave: string, rememberMe: boolean, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.createUserWithEmailAndPassword(usuario, clave)
                .then((res: firebase.auth.UserCredential) => {
                    this.createUserInfoRegiuster(res.user.uid, userData)
                    this.saveAuthInData(usuario, clave, rememberMe, "register");
                    resolve(true)
                }).catch((error: iAuthError) => {
                    reject(error)
                }).finally(() => this.loader.hide())
        })
    }

    public async singIn(usuario, clave, rememberMe) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.signInWithEmailAndPassword(usuario, clave)
                .then(() => {
                    this.saveAuthInData(usuario, clave, rememberMe, "login");
                    resolve(true)
                }).catch(
                    (error: iAuthError) => {
                        reject(error)
                    }
                ).finally(() => {
                    this.loader.hide()
                })
        });
    }

    public async singOut() {
        this.loader.show();
        await this.fireAuth.signOut();
        this.loader.hide();
        this.router.navigateByUrl('/authuser');
    }

    private async createUserInfoRegiuster(uid: string, userData: ClinicUser) {
        userData.uid = uid;
        this.fbsorageservice.create(eCollections.users, userData)
    }

    private async saveAuthInData(usuario, clave, rememberMe, type) {
        // this.userMail$.next(usuario);
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
