
import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { ClinicUser, Appointment, AttentionSpaces, Profesional, Specialties } from '../../../../class/data.model';
import { CalendarService, CALCOLORS } from '../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../services/fb-auth.service';

@Component({
    selector: 'app-appointments-pat',
    templateUrl: './appointments-pat.component.html',
    styleUrls: ['./appointments-pat.component.scss']
})
export class AppointmentsPatComponent implements OnInit {
    attentionSpaces: AttentionSpaces[];
    profesionals: Profesional[];
    specialties: Specialties[];
    selectAttentionSpace: AttentionSpaces;
    @Input()selectSpecialty: Specialties;
    @Input()selectProfesional: Profesional;

    currentUser: ClinicUser
    // filterdEvents: CalendarEvent<Appointment>[] = []
    appointmentsForomService: Appointment[]
    // filterdAppointments: Appointment[] = []
    events: CalendarEvent<Appointment>[] = [];

    constructor(private calendar: CalendarService, private authservice: FbAuthService) { }

    ngOnInit(): void {
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            // console.log("current user appointment", user)
            // this.calendar.getAppointmentsList() 
            this.subscribeToAppointments()
            this.getTablas();
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
        let userOnlyAp: Appointment[] = []
        if (this.currentUser) {
            userOnlyAp = list.filter((ap: Appointment) => {
                return (ap.patient.id == this.currentUser.id)
            })
        }
        return userOnlyAp
    }
    private setEvents(list: Appointment[]): CalendarEvent<Appointment>[] {
        let events: CalendarEvent<Appointment>[] = []
        if (list) {
            events = list.map((appointment: Appointment) => {
                if (this.currentUser && appointment) {
                    let color = CALCOLORS.grey
                    let title: string = ''
                    let actions: CalendarEventAction[] = []
                    if (this.currentUser.id == appointment.patient.id) {
                        title = appointment.specialty + ' ' + appointment.profesional.lastname + ', ' + appointment.profesional.name;
                        if (appointment.acceptance) {
                            color = CALCOLORS.green;
                        } else {
                            color = CALCOLORS.yellow
                        }
                    }
                    if (this.selectProfesional && this.calendar.isOutOfProTime(appointment, this.selectProfesional)) {
                        // title = 'Fuera del horario de atencion'
                        color = CALCOLORS.red
                    }
                    let event: CalendarEvent<Appointment> = {
                        start: new Date(appointment.start),
                        end: new Date(appointment.end),
                        actions: actions,
                        meta: appointment,
                        title: title,
                        color: color
                    }
                    return event;
                }
            })
        }
        events = [
            ...events,
            ...this.calendar.getDisableSaturdaysEvents(),
            ...this.calendar.getDisableProfesionalEvents(this.selectProfesional)
        ]
        console.log("events", events)
        return events
    }


    public onFilterEvents(): void {
        console.log("onFilterEvents")
        let appointments: Appointment[] = []
        appointments = this.getUserOnlyAppointments(this.appointmentsForomService)
        if (this.selectProfesional) {
            let filterdAppointments = this.appointmentsForomService.filter((ap: Appointment) => {
                if (ap.patient.id == this.currentUser.id) {
                    return false;
                }
                return (ap.profesional && ap.profesional.id != this.selectProfesional.id)

                // if (this.selectSpecialty) {
                //     return (ap.meta && ap.meta.specialty == this.selectSpecialty.name)
                // }
                // return true
            })
            appointments = [...appointments, ...filterdAppointments]
            console.log("filterdAppointments", filterdAppointments)
        }

        this.events = this.setEvents(appointments);
    }
    private getTablas() {
        this.calendar.getAttentionSpaces().then((list: AttentionSpaces[]) => { this.attentionSpaces = list })
        this.calendar.getProfecionals().then((list: Profesional[]) => {
            this.profesionals = list;
            //  this.selectProfesional = list[0]
        })
        this.calendar.getSpecialties().then((list: Specialties[]) => {
            this.specialties = list;
            // this.selectSpecialty = list[0] 
        })
    }
}
