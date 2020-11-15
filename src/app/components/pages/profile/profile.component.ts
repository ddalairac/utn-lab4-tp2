import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Profesional, Patient, Admin, eUserTypes, Specialties } from '../../../class/data.model';
import { eCollections } from '../../../class/firebase.model';
import { DAYS } from '../../../services/calendar-service.service';
import { FbAuthService } from '../../../services/fb-auth.service';
import { FbDBService } from '../../../services/fb-db.service';
import { FbFilesService } from '../../../services/fb-files.service';

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
    // authForm = new FormGroup({})

    userForm: FormGroup = new FormGroup({})

    constructor(private fbauthservice: FbAuthService, private fbFiles: FbFilesService, private fbStorage: FbDBService) { }

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
    private setUserValues(infoUser: Profesional | Patient | Admin): void {
        this.name.setValue(infoUser.name)
        this.lastname.setValue(infoUser.lastname)
        if (infoUser.type == 'Profesional') {
            let infoUserPro: Profesional = infoUser as Profesional;
            this.specialty.setValue(infoUserPro.specialty);
            this.tiempoTurno.setValue(infoUserPro.tiempoTurno);

            if (!infoUserPro.horarios_atencion) {
                infoUserPro.horarios_atencion = {
                    mon: {
                        start: '08:00',
                        end: '19:00',
                        active: false
                    },
                    tue: {
                        start: '08:00',
                        end: '19:00',
                        active: false
                    },
                    wed: {
                        start: '08:00',
                        end: '19:00',
                        active: false
                    },
                    thu: {
                        start: '08:00',
                        end: '19:00',
                        active: false
                    },
                    fri: {
                        start: '08:00',
                        end: '19:00',
                        active: false
                    },
                    sat: {
                        start: '08:00',
                        end: '14:00',
                        active: false
                    }
                }
            }
            this.hourStartMon.setValue(infoUserPro.horarios_atencion.mon.start);
            this.hourEndMon.setValue(infoUserPro.horarios_atencion.mon.end);
            this.hourStartTue.setValue(infoUserPro.horarios_atencion.tue.start);
            this.hourEndTue.setValue(infoUserPro.horarios_atencion.tue.end);
            this.hourStartWed.setValue(infoUserPro.horarios_atencion.wed.start);
            this.hourEndWed.setValue(infoUserPro.horarios_atencion.wed.end);
            this.hourStartThu.setValue(infoUserPro.horarios_atencion.thu.start);
            this.hourEndThu.setValue(infoUserPro.horarios_atencion.thu.end);
            this.hourStartFri.setValue(infoUserPro.horarios_atencion.fri.start);
            this.hourEndFri.setValue(infoUserPro.horarios_atencion.fri.end);
            this.hourStartSat.setValue(infoUserPro.horarios_atencion.sat.start);
            this.hourEndSat.setValue(infoUserPro.horarios_atencion.sat.end);
            this.hourMonCK.setValue(infoUserPro.horarios_atencion.mon.active);
            this.hourTueCK.setValue(infoUserPro.horarios_atencion.tue.active);
            this.hourWedCK.setValue(infoUserPro.horarios_atencion.wed.active);
            this.hourThuCK.setValue(infoUserPro.horarios_atencion.thu.active);
            this.hourFriCK.setValue(infoUserPro.horarios_atencion.fri.active);
            this.hourSatCK.setValue(infoUserPro.horarios_atencion.sat.active);
            this.hourCK('Mon', infoUserPro.horarios_atencion.mon.active);
            this.hourCK('Tue', infoUserPro.horarios_atencion.tue.active);
            this.hourCK('Wed', infoUserPro.horarios_atencion.wed.active);
            this.hourCK('Thu', infoUserPro.horarios_atencion.thu.active);
            this.hourCK('Fri', infoUserPro.horarios_atencion.fri.active);
            this.hourCK('Sat', infoUserPro.horarios_atencion.sat.active);

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
            infoUserPro.horarios_atencion.mon.start = this.hourStartMon.value
            infoUserPro.horarios_atencion.mon.end = this.hourEndMon.value
            infoUserPro.horarios_atencion.tue.start = this.hourStartTue.value
            infoUserPro.horarios_atencion.tue.end = this.hourEndTue.value
            infoUserPro.horarios_atencion.wed.start = this.hourStartWed.value
            infoUserPro.horarios_atencion.wed.end = this.hourEndWed.value
            infoUserPro.horarios_atencion.thu.start = this.hourStartThu.value
            infoUserPro.horarios_atencion.thu.end = this.hourEndThu.value
            infoUserPro.horarios_atencion.fri.start = this.hourStartFri.value
            infoUserPro.horarios_atencion.fri.end = this.hourEndFri.value
            infoUserPro.horarios_atencion.sat.start = this.hourStartSat.value
            infoUserPro.horarios_atencion.sat.end = this.hourEndSat.value
            infoUserPro.horarios_atencion.mon.active = this.hourMonCK.value
            infoUserPro.horarios_atencion.tue.active = this.hourTueCK.value
            infoUserPro.horarios_atencion.wed.active = this.hourWedCK.value
            infoUserPro.horarios_atencion.thu.active = this.hourThuCK.value
            infoUserPro.horarios_atencion.fri.active = this.hourFriCK.value
            infoUserPro.horarios_atencion.sat.active = this.hourSatCK.value
            infoUser = infoUserPro;
        }
        console.log("infoUser: ", infoUser)
        return infoUser
    }
    public onFileLoad(event) {
        console.log("onFileLoad: ", event)
        this.fbFiles.fileupLoad('users', event).then(
            img => {
                console.log("uploaded img: ", img)
                this.userInfo.picture = img
                this.fbStorage.update(eCollections.users, this.userInfo.id, this.userInfo).catch(error=>console.error("onFileLoad update",error))
            }
        )
    }
    private validateHour(day: string): boolean {
        if (this['hour' + day + 'CK'].value) {
            // console.log(day, ' Activo')
            let start: FormControl = this['hourStart' + day]
            let end: FormControl = this['hourEnd' + day]

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
        } else {
            // console.log(day, ' Inactivo')
            return true
        }
    }
    public validateHous(): boolean {
        // let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        DAYS.forEach((d) => {
            if (!this.validateHour(d)) { return false }
        })
        return true
    }
    public onHourCK(day: string) {
        this['hour' + day + 'CK'].setValue(!this['hour' + day + 'CK'].value)
        this.hourCK(day, this['hour' + day + 'CK'].value)
    }
    private hourCK(day, value) {
        if (value) {
            this['hourStart' + day].enable();
            this['hourEnd' + day].enable();
        } else {
            this['hourStart' + day].disable();
            this['hourEnd' + day].disable();
        }
    }
    public onSubmit() {
        if (this.userForm.valid && this.validateHous()) {
            this.fbStorage.update(eCollections.users, this.userInfo.id, this.getUserValues()).then(res => console.log("res: ", res))
            .catch(error=>console.error("onSubmit update profile",error))
        }
    }
}



