import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClinicUser, Appointment, iModalData, eSpacesTypes, Profesional, Patient } from '../../../../../class/data.model';
import { CalendarService } from '../../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { CalendarModalComponent } from '../../../../cross/calendar-modal/calendar-modal.component';

@Component({
    selector: 'app-calendar-modal-pro',
    templateUrl: './calendar-modal-pro.component.html',
    styleUrls: ['./calendar-modal-pro.component.scss']
})
export class CalendarModalProComponent implements OnInit {


    currentUser: ClinicUser;
    appointment: Appointment
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
        this.appointment.acceptance = true;
        this.calendar.updateCalendarEvent(this.appointment.id, this.appointment);
        this.dialogRef.close();
    }
    public onDelete() {
        console.log("onDelete")
        this.calendar.deleteCalendarEvent(this.appointment.id);
        this.dialogRef.close();
    }
    private parseApointment() {
        this.appointment = this.data.event.meta
    }

}
