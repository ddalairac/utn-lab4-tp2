import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment, ClinicUser, eSpacesTypes, iModalData, Patient, Profesional, Specialties } from '../../../../../class/data.model';
import { CalendarService } from '../../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { CalendarModalComponent } from '../../../../cross/calendar-modal/calendar-modal.component';

@Component({
    selector: 'app-calendar-modal-pat',
    templateUrl: './calendar-modal-pat.component.html',
    styleUrls: ['./calendar-modal-pat.component.scss']
})
export class CalendarModalPatComponent implements OnInit {

    currentUser: ClinicUser;
    appointment: Appointment
    message:string;
    constructor(
        private calendar: CalendarService,
        private authservice: FbAuthService,
        public dialogRef: MatDialogRef<CalendarModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: iModalData) { }

    ngOnInit(): void {
        console.log("Modal data", this.data)
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            console.log("current user modal", user)

            this.parseApointment()
        })
    }

    public onCancel(): void {
        console.log("onCancel")
        this.dialogRef.close();
    }
    public onAcept() {
        console.log("onAcept")
        if (this.data.action == "new" && this.appointment) {
            this.calendar.createAppointment(this.appointment);
        }
        this.dialogRef.close();
    }
    public onDelete() {
        console.log("onDelete")
        this.calendar.deleteAppointment(this.data.event.meta.id);
        this.dialogRef.close();
    }
    private parseApointment() {
        this.message = null

        let space: eSpacesTypes;
        let spaceName: string;
        let profesional: Profesional;
        let specialty: string;
        let start: Date | number;
        let end: Date | number;
        let patient: Patient;
        let acceptance: boolean

        if (this.data.action == "Clicked") {
            space = this.data.event.meta.space
            spaceName = this.data.event.meta.spaceName
            profesional = this.data.event.meta.profesional
            specialty = this.data.event.meta.specialty
            start = this.data.event.meta.start
            end = this.data.event.meta.end
            patient = this.data.event.meta.patient
            acceptance = this.data.event.meta.acceptance
            this.setAppointment(space, spaceName, profesional, specialty, start, end, patient, acceptance);
        } else if (this.data.action == "new" && this.data.selectProfesional && this.data.selectSpecialty) {
            space = eSpacesTypes.office;
            spaceName = "1";
            profesional = this.data.selectProfesional;
            specialty = this.data.selectSpecialty.name;
            start = this.data.event.start;
            end = this.data.event.end;
            patient = this.currentUser as Patient;
            acceptance = false
            this.setAppointment(space, spaceName, profesional, specialty, start, end, patient, acceptance);
        } else {
            this.message = 'Debe seleccionar Profesional y Especialidad para pedir un nuevo turno'
        }   


    }
    private setAppointment(space: eSpacesTypes, spaceName: string, profesional: Profesional, specialty: string, start: Date | number, end: Date | number, patient: Patient, acceptance: boolean): void {
        this.appointment = {
            space: space,
            spaceName: spaceName,
            profesional: profesional,
            specialty: specialty,
            start: start,
            end: end,
            patient: patient,
            acceptance: acceptance,
            clinicHistoryCompleted:false
        }
    }
}
