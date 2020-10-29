import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarView, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { Appointment, Profesional, Specialties, ClinicUser, iModalData } from '../../../../../class/data.model';
import { CalendarService, calColor } from '../../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { CalendarModalPatComponent } from '../../../patients/appointments-pat/calendar-modal-pat/calendar-modal-pat.component';
import { CalendarModalProComponent } from '../calendar-modal-pro/calendar-modal-pro.component';

@Component({
    selector: 'app-calendar-pro',
    templateUrl: './calendar-pro.component.html',
    styleUrls: ['./calendar-pro.component.scss']
})
export class CalendarProComponent implements OnInit {


    @Input() events: CalendarEvent<Appointment>[] = []
    // @Input() selectProfesional: Profesional;
    // @Input() selectSpecialty: Specialties;

    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    constructor(public dialog: MatDialog, private calendar: CalendarService, private authservice: FbAuthService) { }
    ngOnInit(): void {
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            // console.log("current user calendar", user)
        })
    }

    // attentionSpaces: AttentionSpaces[];
    // profesionals: Profesional[];
    // specialties: Specialties[];
    // selectAttentionSpace: AttentionSpaces;


    currentUser: ClinicUser
    CalendarView = CalendarView;
    view: CalendarView = CalendarView.Week;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    actions: CalendarEventAction[] = [
        // {
        //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
        //     a11yLabel: 'Edit',
        //     onClick: ({ event }: { event: CalendarEvent }): void => {
        //         this.handleEvent('Edited', event);
        //     },
        // },
        // {
        //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
        //     a11yLabel: 'Delete',
        //     onClick: ({ event }: { event: CalendarEvent }): void => {
        //         this.events = this.events.filter((iEvent) => iEvent !== event);
        //         this.handleEvent('Deleted', event);
        //     },
        // },
    ];


    activeDayIsOpen: boolean = true;
    // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    //     if (isSameMonth(date, this.viewDate)) {
    //         if (
    //             (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //             events.length === 0
    //         ) {
    //             this.activeDayIsOpen = false;
    //         } else {
    //             this.activeDayIsOpen = true;
    //         }
    //         this.viewDate = date;
    //     }
    // }

    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        console.log("eventTimesChanged: ", { event, newStart, newEnd })
        
        event.meta.start = newStart.toString()
        event.meta.end = newEnd.toString()
        this.calendar.updateCalendarEvent(event.meta.id, event.meta);

        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }
    eventClicked(action: string, event: CalendarEvent) {
        this.handleEvent(action, event)
    }
    hourSegmentClicked(event) {
        // console.log("hourSegmentClicked", event)
        // let newEvent: CalendarEvent = {
        //     start: new Date(event.date),
        //     end: addHours(new Date(event.date), 1),
        //     title: '',
        //     color: calColor.yellow,
        //     actions: this.actions,
        //     draggable: true,
        // }
        // // this.events = [...this.events, newEvent]
        // this.handleEvent("new", newEvent)
    }
    handleEvent(action: string, event: CalendarEvent<Appointment>): void {
        if (action == "Dropped or resized") {

        } else {
            let modalData: iModalData = { event: event, action: action /*, selectProfesional: this.selectProfesional, selectSpecialty: this.selectSpecialty  */ }
            console.log("handleEvent modalData: ", modalData)

            const dialogRef = this.dialog.open(CalendarModalProComponent, {
                width: '998px',
                maxWidth: '90%',
                data: modalData
            });

            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed', result);
            });
        }
        console.log("handleEvent: ", action, event)
    }
    beforeViewRender(event) {
        console.log("beforeViewRender", event)
    }
    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter((event) => event !== eventToDelete);
    }
    setView(view: CalendarView) {
        this.view = view;
    }
    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

}
