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
        return true;
        return this.checkRoute(this.router.url);
        // return this.checkRoute(state.url);
    }
    private checkRoute(path:string):boolean{

        let type: eUserTypes | null = this.fbauthservice.type;

        console.log("valid url:", type, path)
        if (!type) {

            this.router.navigate(['/authuser'])
            return false;
        } else {
            switch (type) {
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
        }
        return true;


        // console.log("checkRoute: ",this.router.url)
        // if (path === '/authuser') {
        //     return true;

        // } else if(this.fbauthservice.isLogged$){
        //     return true;
        // }
        // this.router.navigate(['/authuser'])
        // return false;





        // this.fbauthservice.userInfo$.subscribe(
        //     (user: ClinicUser) => {
        //         console.log("valid url user:", user)
        //         if (!user) {
        //             this.router.navigate(['/authuser'])
        //             return false;
        //         } else {
        //             switch (user.type) {
        //                 case eUserTypes.admin:
        //                     switch (path) {
        //                         case './patients':
        //                         case './profesionals':
        //                             this.router.navigate(['/home'])
        //                             return false
        //                     }
        //                     break
        //                 case eUserTypes.patient:
        //                     switch (path) {
        //                         case './admin':
        //                         case './profesionals':
        //                             this.router.navigate(['/home'])
        //                             return false
        //                     }
        //                     break
        //                 case eUserTypes.profesional:
        //                     switch (path) {
        //                         case './admin':
        //                         case './patients':
        //                             this.router.navigate(['/home'])
        //                             return false
        //                     }
        //                     break
        //                 default:
        //                     return true
        //             }
        //         }
        //     }
        // );
        // console.log("valid url path:",path )
        // return true
    }
}

