import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarView, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { ClinicUser, Appointment, AttentionSpaces, Profesional, Specialties, iModalData } from '../../../../../class/data.model';
import { CalendarService, calColor } from '../../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { CalendarModalComponent } from '../../../../cross/calendar-modal/calendar-modal.component';
import { CalendarModalPatComponent } from '../calendar-modal-pat/calendar-modal-pat.component';

@Component({
    selector: 'app-calendar-pat',
    templateUrl: './calendar-pat.component.html',
    styleUrls: ['./calendar-pat.component.scss']
})
export class CalendarPatComponent implements OnInit {

    @Input() events: CalendarEvent<Appointment>[] = []
    @Input() selectProfesional: Profesional;
    @Input() selectSpecialty: Specialties;

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
        console.log("hourSegmentClicked", event)
        let newEvent: CalendarEvent = {
            start: new Date(event.date),
            end: addHours(new Date(event.date), 1),
            title: '',
            color: calColor.yellow,
            actions: this.actions,
            draggable: true,
        }
        // this.events = [...this.events, newEvent]
        this.handleEvent("new", newEvent)
    }
    handleEvent(action: string, event: CalendarEvent): void {
        let modalData: iModalData = { event: event, action: action, selectProfesional: this.selectProfesional, selectSpecialty: this.selectSpecialty }
        console.log("handleEvent modalData: ", modalData)

        const dialogRef = this.dialog.open(CalendarModalPatComponent, {
            width: '998px',
            maxWidth: '90%',
            data: modalData
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }
    beforeViewRender(event) {
        console.log("beforeViewRender", event)
    }

    addEvent(): void {
        // this.events = [
        //     ...this.events,
        //     {
        //         title: 'New event',
        //         start: startOfDay(new Date()),
        //         end: endOfDay(new Date()),
        //         color: calColor.red,
        //         draggable: false,
        //         resizable: {
        //             beforeStart: true,
        //             afterEnd: true,
        //         },
        //     },
        // ];
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
