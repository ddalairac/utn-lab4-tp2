import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Profesional, Patient, Admin, eUserTypes } from '../../../class/data.model';
import { FbAuthService } from '../../../services/fb-auth.service';
import { FbStoreService } from '../../../services/fb-store.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    public userInfo: Profesional | Patient | Admin | null;
    public userMail: string = '';
    picture = new FormControl();

    constructor(private fbauthservice: FbAuthService, private fbStore: FbStoreService) { }

    ngOnInit(): void {
        this.fbauthservice.userFB$.subscribe(
            (userFB: firebase.User) => {
                console.log("profile userFB", userFB)
                this.userMail = (userFB) ? userFB.email : null;
            }
        )
        this.fbauthservice.userInfo$.subscribe(
            (userInfo: Profesional | Patient | Admin) => {
                console.log("profile userInfo", userInfo)
                this.userInfo = userInfo;
            }
        )
    }
    public onFileLoad(event) {
        console.log("onFileLoad: ", event)
        this.fbStore.onAvatarLoad(event).then(
            img => {
                console.log("uploaded img: ", img)
                this.picture.setValue(img)
            }
        )
    }

}
