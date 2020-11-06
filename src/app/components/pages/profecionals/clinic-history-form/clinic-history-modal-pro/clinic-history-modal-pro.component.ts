import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment, ClinicHistory, ClinicUser, ExtraData } from '../../../../../class/data.model';
import { eCollections, iAuthError } from '../../../../../class/firebase.model';
import { CalendarService } from '../../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { FbStorageService } from '../../../../../services/fb-storage.service';
import { CalendarModalComponent } from '../../../../cross/calendar-modal/calendar-modal.component';

@Component({
    selector: 'app-clinic-history-modal-pro',
    templateUrl: './clinic-history-modal-pro.component.html',
    styleUrls: ['./clinic-history-modal-pro.component.scss']
})
export class ClinicHistoryModalProComponent implements OnInit {

    currentUser: ClinicUser;
    constructor(private authservice: FbAuthService,
        private calendarService:CalendarService,
        private fbsorageservice: FbStorageService,
        public dialogRef: MatDialogRef<CalendarModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Appointment) { }


    age = new FormControl('', [Validators.required])
    body_temperature = new FormControl('', [Validators.required])
    blood_pressure = new FormControl('', [Validators.required])
    text = new FormControl('')
    clinicHistoryForm = new FormGroup({
        age: this.age,
        body_temperature: this.body_temperature,
        blood_pressure: this.blood_pressure,
        text: this.text
    })

    ngOnInit(): void {
        console.log("Modal data", this.data)
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            console.log("current user modal", user)
        })
    }
    onSubmit() {
        if (this.clinicHistoryForm.valid) {
            this.setNewCH(this.age.value, this.body_temperature.value, this.blood_pressure.value, this.text.value)
        }
    }
    setNewCH(age: number, body_temperature: number, blood_pressure: string, text: string = '', extra_data: ExtraData[] = []) {
        let ch: ClinicHistory = {
            profesional: this.data.profesional,
            patient: this.data.patient,
            specialty: this.data.specialty,
            date: this.data.start,
            age: age,
            body_temperature: body_temperature,
            blood_pressure: blood_pressure,
            extra_data: extra_data,
            text: text
        }
        this.fbsorageservice.create(eCollections.clinicHistory, ch).then(()=>{
            this.data.clinicHistoryCompleted = true;
            this.calendarService.updateCalendarEvent(this.data.id,this.data)
            this.dialogRef.close();
        }).catch(error=>console.error("setNewCH",error))
    } 

}
