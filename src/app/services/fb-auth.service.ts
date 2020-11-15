import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Profesional, Admin, Patient, ClinicUser, eUserTypes } from '../class/data.model';
import { iAuthError, eCollections } from '../class/firebase.model';
import { FbDBService } from './fb-db.service';
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
        private fbDBservice: FbDBService
    ) {
        // this.userMail$ = new BehaviorSubject(null)
        this.userInfo$ = new BehaviorSubject(null);
        this.isLogged$ = new BehaviorSubject(false);
        this.userFB$ = new BehaviorSubject(null);

        this.fireAuth.authState.subscribe(
            async (userFB: firebase.User) => {
                if (userFB) {
                    this.userFB$.next(userFB)
                    this.fbDBservice.getUserInfoByUid(userFB.uid).then((user: ClinicUser) => {
                        this.type = user.type
                        this.userInfo$.next(user)
                        this.isLogged$.next(true);

                        if (!userFB.emailVerified && this.type != eUserTypes.admin
                            && user.mail != 'paciente@gmail.com'
                            && user.mail != 'profesional@gmail.com'
                            && user.mail != 'admin@gmail.com'
                        ) {
                            console.log("emailVerified", userFB.emailVerified)
                            this.router.navigateByUrl('validate-email');
                        } else {
                            this.router.navigateByUrl('home');
                            switch (this.type) {
                                case eUserTypes.admin:
                                    this.router.navigate(['/admins/users'])
                                    break
                                case eUserTypes.patient:
                                    this.router.navigate(['/patients/new-appointment'])
                                    break
                                case eUserTypes.profesional:
                                    this.router.navigate(['/profesionals/appointments'])
                                    break
                            }
                        }
                        // this.router.navigateByUrl('patients/appointments');
                        // this.router.navigateByUrl('profesionals/appointments');
                        // this.router.navigateByUrl('profile');
                    }).catch(error => console.error("getUserInfoByUid", error))


                } else {
                    // this.userMail$.next(null);
                    this.userFB$.next(null)
                    this.userInfo$.next(null);
                    this.isLogged$.next(false);
                    this.type = null;

                    this.router.navigateByUrl('authuser');
                }
            }, (error) => console.error("authState", error)
        )
        // // this.userMail$.subscribe(data => console.log("userMail: ", data))
        // this.userFB$.subscribe((data) => {console.log("userFB: ", data); if(data)console.log("userFB email: ", data.email)})
        // this.userInfo$.subscribe(data => console.log("userInfo: ", data))
        // this.isLogged$.subscribe(data => console.log("isLogged: ", data))
    }

    public recoverPass(email) {
        this.fireAuth.sendPasswordResetEmail(email).then(() => {
            // console.log("Recover Email sent")
        }).catch((error) => {
            console.error("recoverPass", error)
        });
    }
    esperaEnvioMail: boolean
    public async SendVerificationMail() {
        if (this.esperaEnvioMail) {
            setTimeout(() => {
                this.esperaEnvioMail = false
            }, 50000);
            (await this.fireAuth.currentUser).sendEmailVerification().then(() => {
                console.log('email sent');
            }).catch((error) => {
                console.error("SendVerificationMail", error)
            });
        }
        this.esperaEnvioMail = true
    }
    public async registerNewUser(email: string, clave: string, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.createUserWithEmailAndPassword(email, clave)
                .then((res: firebase.auth.UserCredential) => {
                    this.createUserInfoRegiuster(res.user.uid, userData).then(
                        () => {
                            this.singIn(this.loggUser.mail, this.loggUser.pass, this.loggUser.rememberMe);
                            resolve(true)
                        }
                    )
                }).catch((error: iAuthError) => {
                    console.error("registerNewUser", error)
                    resolve(false)
                    // reject(error)
                }).finally(() => this.loader.hide())
        })
    }
    public async removeUser(DBuser: ClinicUser) {
        this.loader.show();

        let backUser = this.userInfo$.getValue()
        let rememberMe: boolean = (window.localStorage.getItem("user")) ? true : false;
        let FBuser: firebase.User
        let FBDelete: boolean
        // console.log("DBuser", DBuser)
        setTimeout(() => {
            return new Promise(async (resolve) => {
                // loguear al usuario a borrar
                await this.fireAuth.signInWithEmailAndPassword(DBuser.mail, DBuser.pass).then(async () => {
                    // console.log("sing in DBuser")
                    // borrar usuario
                    FBuser = await this.fireAuth.currentUser;
                    // console.log("FBuser", FBuser)
                    await FBuser.delete().then(async () => { })
                    // console.log("delete FBuser")
                    FBDelete = true
                }).catch((error: iAuthError) => {
                    console.error("removeFBUser", error)
                    this.loader.hide()
                    resolve(false)
                }).finally(() => this.loader.hide())

                setTimeout(() => {
                    // borrar usuario de la DB
                    // console.log("logg user", backUser)
                    // loguear al Admin / user anterior
                    if (FBDelete) {
                        this.singIn(backUser.mail, backUser.pass, rememberMe).then(() => {
                            this.fbDBservice.delete(eCollections.users, DBuser.id).then(() => {
                                resolve(true)
                            })
                        }).catch((error: iAuthError) => {
                            console.error("removeDBUser", error)
                            resolve(false)
                        }).finally(() => this.loader.hide())
                    } else {
                        // console.log("Problema al eleiminar usuario de FB")
                    }
                }, 100);

            })
        }, 0);
    }

    public async register(email: string, clave: string, rememberMe: boolean, userData: ClinicUser) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.createUserWithEmailAndPassword(email, clave)
                .then((res: firebase.auth.UserCredential) => {
                    this.createUserInfoRegiuster(res.user.uid, userData)
                    this.loggUser = { mail: email, pass: clave, rememberMe: rememberMe };
                    this.saveAuthInData(email, clave, rememberMe, "register");
                    resolve(true)
                }).catch((error: iAuthError) => {
                    console.error("register", error)
                    reject(error)
                }).finally(() => this.loader.hide())
        })
    }

    public async singIn(email, clave, rememberMe) {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.fireAuth.signInWithEmailAndPassword(email, clave)
                .then(() => {
                    this.loggUser = { mail: email, pass: clave, rememberMe: rememberMe };
                    this.saveAuthInData(email, clave, rememberMe, "login");
                    resolve(true)
                }).catch(
                    (error: iAuthError) => {
                        console.error("singIn", error)
                        reject(error)
                    }
                ).finally(() => {
                    this.loader.hide()
                })
        });
    }

    public async singOut() {
        this.loader.show();
        try {
            await this.fireAuth.signOut().catch(error => console.error("singOut", error));
        } catch (error) {
            console.error("singOut", error)
        }
        this.loader.hide();
        this.router.navigateByUrl('/authuser');
    }

    private async createUserInfoRegiuster(uid: string, userData: ClinicUser) {
        userData.uid = uid;
        userData = JSON.parse(JSON.stringify(userData));

        this.fbDBservice.create(eCollections.users, userData).catch(error => console.error("createUserInfoRegiuster", error));
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
    rememberMe?: boolean;
}