import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { ClinicUser, Appointment, AttentionSpaces, Profesional, Specialties } from '../../../../class/data.model';
import { CalendarService, calColor } from '../../../../services/calendar-service.service';
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
    selectProfesional: Profesional;
    selectSpecialty: Specialties;

    currentUser: ClinicUser
    filterdEvents: CalendarEvent<Appointment>[] = []
    events: CalendarEvent<Appointment>[] = [
        //     // {
        //     //     start: new Date('2020-10-23 15:00'),
        //     //     end: new Date('2020-10-23 15:30'),
        //     //     title: '',
        //     //     color: calColor.red,
        //     //     actions: this.actions,
        //     //     // allDay: true,
        //     //     // resizable: {
        //     //     //     beforeStart: true,
        //     //     //     afterEnd: true,
        //     //     // },
        //     //     // draggable: true,
        //     // },
    ];

    constructor(private calendar: CalendarService, private authservice: FbAuthService) { }
    ngOnInit(): void {
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            // console.log("current user appointment", user)
            // this.getCalendarEvents()
            this.listenEvents()
            this.getTablas();
        })
    }
    private listenEvents() {
        this.calendar.getCalendarEvents()
        this.calendar.events$.subscribe(
            (list: Appointment[]) => {
                let events: CalendarEvent<Appointment>[] = []
                events = list.map((appointment: Appointment) => {
                    if (this.currentUser && appointment) {
                        let color = calColor.grey
                        let title: string = ''
                        let actions: CalendarEventAction[] = []
                        if (this.currentUser.id == appointment.patient.id) {
                            title = appointment.specialty + ' ' + appointment.profesional.lastname + ', ' + appointment.profesional.name;
                            if (appointment.acceptance) {
                                color = calColor.green;
                            } else {
                                color = calColor.yellow
                            }
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
                console.log("appointment events", events)
                this.events = events;
            })
    }
    private getTablas() {
        this.calendar.getAttentionSpaces().then((list: AttentionSpaces[]) => { this.attentionSpaces = list })
        this.calendar.getProfecionals().then((list: Profesional[]) => { this.profesionals = list })
        this.calendar.getSpecialties().then((list: Specialties[]) => { this.specialties = list })
    }
    public onFilterEvents(): void {
        this.filterdEvents = this.events.filter((ev: CalendarEvent<Appointment>) => {
            // if (this.selectProfesional) {
            //     return (ev.meta.profesional && ev.meta.profesional.id != this.selectProfesional.id)
            // }
            // if (this.selectSpecialty) {
            //     return (ev.meta && ev.meta.specialty == this.selectSpecialty.name)
            // }
            return true
        })
        // console.log("onFilterEvents", this.filterdEvents)
    }
    // actionsUser: CalendarEventAction[] = [
    //     {
    //         label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    //         a11yLabel: 'Edit',
    //         onClick: ({ event }: { event: CalendarEvent }): void => {
    //             this.handleEvent('Edited', event);
    //         },
    //     },
    //     {
    //         label: '<i class="fas fa-fw fa-trash-alt"></i>',
    //         a11yLabel: 'Delete',
    //         onClick: ({ event }: { event: CalendarEvent }): void => {
    //             this.events = this.events.filter((iEvent) => iEvent !== event);
    //             this.handleEvent('Deleted', event);
    //         },
    //     },
    // ];


}
