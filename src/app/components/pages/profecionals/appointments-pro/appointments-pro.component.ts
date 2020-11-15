import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { AttentionSpaces, Profesional, Specialties, ClinicUser, Appointment } from '../../../../class/data.model';
import { CalendarService, CALCOLORS } from '../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../services/fb-auth.service';

@Component({
    selector: 'app-appointments-pro',
    templateUrl: './appointments-pro.component.html',
    styleUrls: ['./appointments-pro.component.scss']
})
export class AppointmentsProComponent implements OnInit {


    attentionSpaces: AttentionSpaces[];
    profesionals: Profesional[];
    specialties: Specialties[];
    selectAttentionSpace: AttentionSpaces;
    selectProfesional: Profesional;
    selectSpecialty: Specialties;

    appointmentsForomService: Appointment[]
    currentUser: ClinicUser
    filterdEvents: CalendarEvent<Appointment>[] = []
    events: CalendarEvent<Appointment>[] = [];

    constructor(private calendar: CalendarService, private authservice: FbAuthService) { }

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
                    this.appointmentsForomService = list
                    this.events = this.setEvents(this.getUserOnlyAppointments(this.appointmentsForomService));
                }
            })
    }
    private getUserOnlyAppointments(list: Appointment[]): Appointment[] {
        let userOnlyAp: Appointment[] = list.filter((ap: Appointment) => {
            return (ap.profesional.id == this.currentUser.id)
        })
        return userOnlyAp
    }
    private setEvents(list: Appointment[]): CalendarEvent<Appointment>[] {
        let events: CalendarEvent<Appointment>[] = []
        events = list.map((appointment: Appointment) => {
            if (this.currentUser && appointment) {
                let color = CALCOLORS.grey
                let title: string = ''
                let resizable = {
                    beforeStart: false,
                    afterEnd: false,
                }
                let draggable = false;

                let actions: CalendarEventAction[] = []
                if (this.currentUser.id == appointment.profesional.id) {
                    title = appointment.patient.lastname + ', ' + appointment.patient.name + ' ' + appointment.specialty;
                    if (appointment.acceptance) {
                        color = CALCOLORS.green;
                    } else {
                        color = CALCOLORS.yellow
                    }
                    // resizable = {
                    //     beforeStart: true,
                    //     afterEnd: true,
                    // }
                    // draggable = true
                }
                let event: CalendarEvent<Appointment> = {
                    start: new Date(appointment.start),
                    end: new Date(appointment.end),
                    actions: actions,
                    meta: appointment,
                    title: title,
                    color: color,
                    resizable: resizable,
                    draggable: draggable
                }
                return event;
            }
        })
        // console.log("appointment events", events)
        return events
    }

}
