import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Profesional, Admin, Patient, ClinicUser, eUserTypes } from '../class/data.model';
import { iAuthError, eCollections } from '../class/firebase.model';
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

    loggUser: iCurrentUser

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

                    // this.router.navigateByUrl('home');
                    this.router.navigateByUrl('patients/appointments');
                    // this.router.navigateByUrl('profesionals/appointments');
                    // this.router.navigateByUrl('profile');
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

    public async registerNewUser(email: string, clave: string, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {

            this.fireAuth.createUserWithEmailAndPassword(email, clave)
                .then((res: firebase.auth.UserCredential) => {
                    this.createUserInfoRegiuster(res.user.uid, userData).then(
                        ()=>{
                            this.singIn(this.loggUser.mail,this.loggUser.pass,this.loggUser.rememberMe);
                            resolve(true)
                        }
                    )
                }).catch((error: iAuthError) => {
                    reject(error)
                }).finally(() => this.loader.hide())
        })
    }

    public async register(email: string, clave: string, rememberMe: boolean, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.createUserWithEmailAndPassword(email, clave)
                .then((res: firebase.auth.UserCredential) => {
                    this.createUserInfoRegiuster(res.user.uid, userData)
                    this.loggUser = { mail: email, pass: clave,rememberMe:rememberMe };
                    this.saveAuthInData(email, clave, rememberMe, "register");
                    resolve(true)
                }).catch((error: iAuthError) => {
                    reject(error)
                }).finally(() => this.loader.hide())
        })
    }

    public async singIn(email, clave, rememberMe) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.signInWithEmailAndPassword(email, clave)
                .then(() => {
                    this.loggUser = { mail: email, pass: clave,rememberMe:rememberMe };
                    this.saveAuthInData(email, clave, rememberMe, "login");
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

    private async saveAuthInData(email, clave, rememberMe, type) {
        // this.userMail$.next(email);
        if (rememberMe) {
            window.localStorage.setItem("user", JSON.stringify(email));
            window.localStorage.setItem("pass", JSON.stringify(clave));
        } else {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("pass");
        }
        return true
    }
}

interface iCurrentUser {
    mail: string;
    pass: string;
    rememberMe:boolean;
}