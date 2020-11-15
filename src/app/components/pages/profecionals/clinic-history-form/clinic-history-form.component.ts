import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment, ClinicHistory, ClinicUser } from '../../../../class/data.model';
import { eCollections } from '../../../../class/firebase.model';
import { CalendarService } from '../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../services/fb-auth.service';
import { FbDBService } from '../../../../services/fb-db.service';
import { iTableAction, iTableEvent } from '../../../cross/table/table.model';
import { ClinicHistoryModalProComponent } from './clinic-history-modal-pro/clinic-history-modal-pro.component';

@Component({
    selector: 'app-clinic-history-form',
    templateUrl: './clinic-history-form.component.html',
    styleUrls: ['./clinic-history-form.component.scss']
})
export class ClinicHistoryFormComponent implements OnInit {

    constructor(private calendar: CalendarService, private authservice: FbAuthService, public dialog: MatDialog,
        private fbDBservice: FbDBService,) { }

    currentUser: ClinicUser
    incompleteList: iIncompleteList[] = []
    completedList: iCompleteList[] = []
    clinicHistoryForomService: ClinicHistory[] = []
    appointmentsForomService: Appointment[] = []

    ngOnInit(): void {
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            this.calendar.getAppointmentsList()
            this.subscribeToAppointments()
        })
    }
    private subscribeToAppointments() {
        this.calendar.appointments$.subscribe(
            (list: Appointment[]) => {
                if (this.currentUser) {
                    this.appointmentsForomService = list;
                    this.setClinicHistoryList(this.appointmentsForomService);
                }

            })

    }
    private setClinicHistoryList(list: Appointment[]) {
        this.incompleteList = []
        list.forEach((item: Appointment) => {
            if (item.profesional.id == this.currentUser.id && !item.clinicHistoryCompleted) {
                let date = new Date(item.start)
                let listItem: iIncompleteList = {
                    nombre_usuario: item.patient.lastname + ", " + item.patient.name,
                    especialidad: item.specialty,
                    fecha: date.toString(),
                    appointmentData: item
                }
                this.incompleteList.push(listItem)
            }
        })

        this.completedList = []
        this.fbDBservice.readAll(eCollections.clinicHistory).then((data: ClinicHistory[]) => {
            this.clinicHistoryForomService = data
            this.clinicHistoryForomService.forEach((item: ClinicHistory) => {
                if (item.profesional.id == this.currentUser.id) {
                    let date = new Date(item.date)
                    let listItem: iCompleteList = {
                        nombre_usuario: item.patient.lastname + ", " + item.patient.name,
                        especialidad: item.specialty,
                        fecha: date.toString(),
                        clinicHistory: item
                    }
                    this.completedList.push(listItem)
                }
            })
            console.log("completedList", this.completedList)
        })

    }
    incompletedHideCols: string[] = ['appointmentData']
    completedHideCols: string[] = ['clinicHistory']
    completedActions: iTableAction[] = [
        {
            description: "ver",
            icon: "fas fa-eye",
            event: "ver"
        }, {
            description: "editar",
            icon: "fas fa-edit",
            event: "editar"
        }
    ]
    incompletedActions: iTableAction[] = [
        {
            description: "editar",
            icon: "fas fa-edit",
            event: "new"
        },
        // {
        //     description: "borrar",
        //     icon: "fas fa-times",
        //     event: "borrar"
        // }
    ]
    public onIncompletedTableEvent(event: iTableEvent) {
        console.log(event)
        this.openDialogNewCH(event.index)
    }
    private openDialogNewCH(index) {
        let modalData: Appointment = this.incompleteList[index].appointmentData
        console.log("modalData: ", modalData)

        const dialogRef = this.dialog.open(ClinicHistoryModalProComponent, {
            width: '998px',
            maxWidth: '90%',
            data: modalData
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);

            this.subscribeToAppointments()
        });
    }

}

export interface iIncompleteList {
    nombre_usuario: string;
    especialidad: string;
    fecha: string;
    appointmentData: Appointment
}
export interface iCompleteList {
    nombre_usuario: string;
    especialidad: string;
    fecha: string;
    clinicHistory: ClinicHistory
}
export interface iModalCH {
    action: string;
    appointment?: Appointment;
    clinicHistory?: ClinicHistory;
}