import { Component, OnInit } from '@angular/core';
import { FbAuthService } from '../../../../services/fb-auth.service';

@Component({
    selector: 'app-validate-email',
    templateUrl: './validate-email.component.html',
    styleUrls: ['./validate-email.component.scss']
})
export class ValidateEmailComponent implements OnInit {
    public userMail: string = '';

    constructor(private fbauthservice: FbAuthService) { }

    ngOnInit(): void {
        this.fbauthservice.userFB$.subscribe(
            (userFB: firebase.User) => {
                console.log("profile userFB", userFB)
                this.userMail = (userFB) ? userFB.email : null;
                if (this.userMail) this.fbauthservice.SendVerificationMail();
            }
        )
    }

}
