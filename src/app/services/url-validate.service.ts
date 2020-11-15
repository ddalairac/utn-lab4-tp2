import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ClinicUser, eUserTypes } from '../class/data.model';
import { FbAuthService } from './fb-auth.service';

@Injectable({
    providedIn: 'root'
})
export class UrlValidateService {
    constructor(private router: Router, private fbauthservice: FbAuthService) { }
    canActivate(state: RouterStateSnapshot): boolean {
        // return true;
        return this.checkRoute(this.router.url);
        // return this.checkRoute(state.url);
    }
    private checkRoute(path: string): boolean {

        // let type: eUserTypes | null = this.fbauthservice.type;
        let userData = this.fbauthservice.userInfo$.getValue()
        let userFB = this.fbauthservice.userFB$.getValue()

        // console.log("valid url:", path)
        if (!userData || !userData.type) {
            this.router.navigate(['/authuser'])
            return false;
        } else {
            // if (!userFB.emailVerified && !(userFB.email == 'paciente@gmail.com'  || userFB.email == 'profesional@gmail.com' || userFB.email == 'admin@gmail.com')) {
            //     this.router.navigateByUrl('validate-email');
            // } else {
                switch (userData.type) {
                    case eUserTypes.admin:
                        switch (path) {
                            case './patients':
                            case './profesionals':
                                this.router.navigate(['/home'])
                                return false
                        }
                        break
                    case eUserTypes.patient:
                        switch (path) {
                            case './admin':
                            case './profesionals':
                                this.router.navigate(['/home'])
                                return false
                        }
                        break
                    case eUserTypes.profesional:
                        switch (path) {
                            case './admin':
                            case './patients':
                                this.router.navigate(['/home'])
                                return false
                        }
                        break
                }
            // }
        }
        return true;

    }
}

