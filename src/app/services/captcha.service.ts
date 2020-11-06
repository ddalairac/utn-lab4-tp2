import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CaptchaService {
    // https://medium.com/@samuelhenshaw2020/recaptcha-v2-in-angular-8-with-back-end-verification-with-nodejs-9574f297fdef
    constructor(private http: HttpClient) { }

    public validate(token: string): boolean {
        if (token === null || token === undefined) {
            console.log("token empty");
            return false
        } else {
            return true
        }
    }

}
