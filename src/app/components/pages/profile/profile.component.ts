import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Profesional, Patient, Admin, eUserTypes, Specialties } from '../../../class/data.model';
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

    specialtiesList: Specialties[] = []

    picture = new FormControl();

    name = new FormControl({ value: '' }, [Validators.required]);
    lastname = new FormControl({ value: '' }, [Validators.required]);
    specialty = new FormControl({ value: [] }, [Validators.required]);
    tiempoTurno = new FormControl({ value: 30 });

    hourStartMon = new FormControl({ value: '08:00' }, [Validators.required]);
    hourEndMon = new FormControl({ value: '19:00' }, [Validators.required]);
    hourStartTue = new FormControl({ value: '08:00' }, [Validators.required]);
    hourEndTue = new FormControl({ value: '19:00' }, [Validators.required]);
    hourStartWed = new FormControl({ value: '08:00' }, [Validators.required]);
    hourEndWed = new FormControl({ value: '19:00' }, [Validators.required]);
    hourStartThu = new FormControl({ value: '08:00' }, [Validators.required]);
    hourEndThu = new FormControl({ value: '19:00' }, [Validators.required]);
    hourStartFri = new FormControl({ value: '08:00' }, [Validators.required]);
    hourEndFri = new FormControl({ value: '19:00' }, [Validators.required]);
    hourStartSat = new FormControl({ value: '08:00' }, [Validators.required]);
    hourEndSat = new FormControl({ value: '14:00' }, [Validators.required]);
    hourMonCK = new FormControl(false);
    hourTueCK = new FormControl(false);
    hourWedCK = new FormControl(false);
    hourThuCK = new FormControl(false);
    hourFriCK = new FormControl(false);
    hourSatCK = new FormControl(false);
    messageBusinessDaysStart = 'De 08:00 a 19:00';
    messageBusinessDays = 'De 08:00 a 19:00 y Posterior a hora inicio';
    messageStartSat = 'De 08:00 a 14:00';
    messageSat = 'De 08:00 a 14:00 y Posterior a hora inicio';

    //! cambiar mail y pass
    authForm = new FormGroup({})

    userForm: FormGroup = new FormGroup({})

    constructor(private fbauthservice: FbAuthService, private fbStore: FbStoreService, private fbStorage: FbStorageService) { }

    ngOnInit(): void {
        this.fbStorage.readAll(eCollections.specialties).then((list) => this.specialtiesList = list)
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
                if (userInfo) {
                    this.createFormGroup(userInfo.type)
                    this.setUserValues(userInfo)
                }
            }
        )
    }
    private createFormGroup(type: eUserTypes) {
        if (type == eUserTypes.profesional) {
            this.userForm = new FormGroup({
                name: this.name,
                lastname: this.lastname,
                specialty: this.specialty,
                tiempoTurno: this.tiempoTurno,
                hourStartMon: this.hourStartMon,
                hourEndMon: this.hourEndMon,
                hourStartTue: this.hourStartTue,
                hourEndTue: this.hourEndTue,
                hourStartWed: this.hourStartWed,
                hourEndWed: this.hourEndWed,
                hourStartThu: this.hourStartThu,
                hourEndThu: this.hourEndThu,
                hourStartFri: this.hourStartFri,
                hourEndFri: this.hourEndFri,
                hourStartSat: this.hourStartSat,
                hourEndSat: this.hourEndSat,
            })
        } else {

            this.userForm = new FormGroup({
                name: this.name,
                lastname: this.lastname
            })
        }
        console.log("createFormGroup", this.userForm)
    }

    validateHour(start: FormControl, end: FormControl): boolean {
        if (start.value < '08:00' || start.value > '19:00') {
            start.setErrors({ error: 'Fuera de rango' });
            return false
        } else if (end.value < '08:00' || end.value > '19:00') {
            end.setErrors({ error: 'Fuera de rango' });
            return false
        } else if (start.value > end.value) {
            start.setErrors({ error: 'Es anterior a hora inicio' });
            return false
        } else {
            return true;
        }
    }
    validateHous(): boolean {
        if (!this.validateHour(this.hourStartMon, this.hourEndMon)) { return false }
        if (!this.validateHour(this.hourStartTue, this.hourEndTue)) { return false }
        if (!this.validateHour(this.hourStartWed, this.hourEndWed)) { return false }
        if (!this.validateHour(this.hourStartThu, this.hourEndThu)) { return false }
        if (!this.validateHour(this.hourStartFri, this.hourEndFri)) { return false }
        if (!this.validateHour(this.hourStartSat, this.hourEndSat)) { return false }
        return true
    }

    private setUserValues(infoUser: Profesional | Patient | Admin): void {
        this.name.setValue(infoUser.name)
        this.lastname.setValue(infoUser.lastname)
        if (infoUser.type == 'Profesional') {
            let infoUserPro: Profesional = infoUser as Profesional;
            this.specialty.setValue(infoUserPro.specialty);
            this.tiempoTurno.setValue(infoUserPro.tiempoTurno);
            this.hourStartMon.setValue(infoUserPro.horarios_atencion.hourStartMon);
            this.hourEndMon.setValue(infoUserPro.horarios_atencion.hourEndMon);
            this.hourStartTue.setValue(infoUserPro.horarios_atencion.hourStartTue);
            this.hourEndTue.setValue(infoUserPro.horarios_atencion.hourEndTue);
            this.hourStartWed.setValue(infoUserPro.horarios_atencion.hourStartWed);
            this.hourEndWed.setValue(infoUserPro.horarios_atencion.hourEndWed);
            this.hourStartThu.setValue(infoUserPro.horarios_atencion.hourStartThu);
            this.hourEndThu.setValue(infoUserPro.horarios_atencion.hourEndThu);
            this.hourStartFri.setValue(infoUserPro.horarios_atencion.hourStartFri);
            this.hourEndFri.setValue(infoUserPro.horarios_atencion.hourEndFri);
            this.hourStartSat.setValue(infoUserPro.horarios_atencion.hourStartSat);
            this.hourEndSat.setValue(infoUserPro.horarios_atencion.hourEndSat);
            this.hourMonCK.setValue(infoUserPro.horarios_atencion.hourMonCK);
            this.hourTueCK.setValue(infoUserPro.horarios_atencion.hourTueCK);
            this.hourWedCK.setValue(infoUserPro.horarios_atencion.hourWedCK);
            this.hourThuCK.setValue(infoUserPro.horarios_atencion.hourThuCK);
            this.hourFriCK.setValue(infoUserPro.horarios_atencion.hourFriCK);
            this.hourSatCK.setValue(infoUserPro.horarios_atencion.hourSatCK);
            this.hourCK('Mon',infoUserPro.horarios_atencion.hourMonCK);
            this.hourCK('Tue',infoUserPro.horarios_atencion.hourTueCK);
            this.hourCK('Wed',infoUserPro.horarios_atencion.hourWedCK);
            this.hourCK('Thu',infoUserPro.horarios_atencion.hourThuCK);
            this.hourCK('Fri',infoUserPro.horarios_atencion.hourFriCK);
            this.hourCK('Sat',infoUserPro.horarios_atencion.hourSatCK);
        }
    }
    private getUserValues(): Profesional | Patient | Admin {
        let infoUser: Profesional | Patient | Admin = this.userInfo
        infoUser.name = this.name.value
        infoUser.lastname = this.lastname.value
        if (infoUser.type == 'Profesional') {
            let infoUserPro: Profesional = infoUser as Profesional
            infoUserPro.specialty = this.specialty.value
            infoUserPro.tiempoTurno = this.tiempoTurno.value
            infoUserPro.horarios_atencion.hourStartMon = this.hourStartMon.value
            infoUserPro.horarios_atencion.hourEndMon = this.hourEndMon.value
            infoUserPro.horarios_atencion.hourStartTue = this.hourStartTue.value
            infoUserPro.horarios_atencion.hourEndTue = this.hourEndTue.value
            infoUserPro.horarios_atencion.hourStartWed = this.hourStartWed.value
            infoUserPro.horarios_atencion.hourEndWed = this.hourEndWed.value
            infoUserPro.horarios_atencion.hourStartThu = this.hourStartThu.value
            infoUserPro.horarios_atencion.hourEndThu = this.hourEndThu.value
            infoUserPro.horarios_atencion.hourStartFri = this.hourStartFri.value
            infoUserPro.horarios_atencion.hourEndFri = this.hourEndFri.value
            infoUserPro.horarios_atencion.hourStartSat = this.hourStartSat.value
            infoUserPro.horarios_atencion.hourEndSat = this.hourEndSat.value
            infoUserPro.horarios_atencion.hourMonCK = this.hourMonCK.value
            infoUserPro.horarios_atencion.hourTueCK = this.hourTueCK.value
            infoUserPro.horarios_atencion.hourWedCK = this.hourWedCK.value
            infoUserPro.horarios_atencion.hourThuCK = this.hourThuCK.value
            infoUserPro.horarios_atencion.hourFriCK = this.hourFriCK.value
            infoUserPro.horarios_atencion.hourSatCK = this.hourSatCK.value
            infoUser = infoUserPro;
        }
        console.log("infoUser: ", infoUser)
        return infoUser
    }

    public onFileLoad(event) {
        console.log("onFileLoad: ", event)
        this.fbStore.fileupLoad('users', event).then(
            img => {
                console.log("uploaded img: ", img)
                this.userInfo.picture = img
                this.fbStorage.update(eCollections.users, this.userInfo.id, this.userInfo)
            }
        )
    }
    public onSubmit() {
        if (this.userForm.valid && this.validateHous()) {
            this.fbStorage.update(eCollections.users, this.userInfo.id, this.getUserValues()).then(res => console.log("res: ", res))
        }
    }
    public onHourCK(day:string) {
        // let days = ['Mon','Tue','Wed','Thu','Fri','Sat']
        this['hour'+day+'CK'].setValue(!this['hour'+day+'CK'].value)
        this.hourCK(day,this['hour'+day+'CK'].value)
    }
    private hourCK(day,value){
        // console.log("day", day,this['hour'+day+'CK'].value)
        // if (this['hour'+day+'CK'].value) {
        if (value) {
            this['hourStart'+day].enable();
            this['hourEnd'+day].enable();
        } else {
            this['hourStart'+day].disable();
            this['hourEnd'+day].disable();
        }
    }
}



