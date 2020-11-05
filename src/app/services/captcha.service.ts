import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CaptchaService {

    constructor(private http: HttpClient) { }


    public validate(token: string):boolean {
        if (token === null || token === undefined) {
            console.log("token empty");
            return false
        } else {
            // // let secretKey: string = environment.reCAPTCHASecret;
            // // // let url: string = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
            // // let url: string = `https://www.google.com/recaptcha/api/siteverify`
            // // let rHeader = new Headers()

            // // // rHeader.append('Content-Type', 'application/json');
            // // rHeader.append('Content-Type', 'application/x-www-form-urlencoded');
            // // // rHeader.append('Access-Control-Allow-Origin', '*');

            // // // rHeader.append('GET', 'POST', 'OPTIONS');
            // // let rBody = JSON.stringify({ secret: secretKey, response: token })
            // // fetch(url, {
            // //     method: 'post',
            // //     headers: rHeader,
            // //     body: rBody
            // // }).then((data) => {
            // //     console.log('response', data)
            // // })
            // // // return this.http.post<any>('https://www.google.com/recaptcha/api/siteverify',)
            return true
        }
    }

    verifyCallback(response) {
        alert(response);
    };
    widgetId1;
    widgetId2;
    onloadCallback() {
        // Renders the HTML element with id 'example1' as a reCAPTCHA widget.
        // The id of the reCAPTCHA widget is assigned to 'widgetId1'.
        this.widgetId1 = grecaptcha.render('example1', {
            'sitekey': environment.reCAPTCHASecret,
            'theme': 'light'
        });
        this.widgetId2 = grecaptcha.render(document.getElementById('example2'), {
            'sitekey': environment.reCAPTCHASecret
        });
        grecaptcha.render('example3', {
            'sitekey': environment.reCAPTCHASecret,
            'callback': this.verifyCallback,
            'theme': 'dark'
        });
    };
}
