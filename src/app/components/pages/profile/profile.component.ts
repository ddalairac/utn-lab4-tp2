import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Profesional, Patient, Admin, eUserTypes } from '../../../class/data.model';
import { FbAuthService } from '../../../services/fb-auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    public userInfo: Profesional | Patient | Admin | null;
    public userMail;
    picture = new FormControl();
    
    constructor(private fbauthservice: FbAuthService) { }

    ngOnInit(): void {
        this. userMail = this.fbauthservice.userMail;
        this.fbauthservice.userInfo$.subscribe(
            (info: Profesional | Patient | Admin | null) => {
                this.userInfo = info;
            }
        )
    }

}
