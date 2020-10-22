import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Profesional, Patient, Admin, eUserTypes } from '../../../class/data.model';
import { eCollections } from '../../../class/firebase.model';
import { FbAuthService } from '../../../services/fb-auth.service';
import { FbStorageService } from '../../../services/fb-storage.service';
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

    type = new FormControl({value:'',disabled: true}, [Validators.required]);
    name = new FormControl({value:'',disabled: true}, [Validators.required]);
    lastname = new FormControl({value:'',disabled: true}, [Validators.required]);
    specialty = new FormControl({value:[],disabled: true}, [Validators.required]);
    tiempoTurno = new FormControl({value:30,disabled: true});
    horarios_atencion = new FormControl({value:[],disabled: true});

    time
    constructor(private fbauthservice: FbAuthService, private fbStore: FbStoreService, private fbStorage: FbStorageService) { }

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
        this.fbStore.onAvatarLoad('users', event).then(
            img => {
                console.log("uploaded img: ", img)
                this.userInfo.picture = img
                this.fbStorage.update(eCollections.users, this.userInfo.id, this.userInfo)
            }
        )
    }
    // updateProfileImg(img){
    //     this.fbStorage.update(eCollections.users, this.userInfo.id, this.userInfo)
    // }
    logtime(){console.log(this.time)}
}
