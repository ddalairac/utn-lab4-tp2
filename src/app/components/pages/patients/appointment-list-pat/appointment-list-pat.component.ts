import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { subDays, startOfDay, addDays, endOfMonth, addHours, isSameMonth, isSameDay, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarModalComponent } from '../../../cross/calendar-modal/calendar-modal.component';
import { calColor, CalendarService } from '../../../../services/calendar-service.service';
import { Appointment } from '../../../../class/data.model';

/**
 * Calendario
 * https://openbase.io/js/angular-calendar#getting-started
 */

@Component({
    selector: 'app-appointment-list-pat',
    templateUrl: './appointment-list-pat.component.html',
    styleUrls: ['./appointment-list-pat.component.scss']
})
export class AppointmentListPatComponent implements OnInit {

    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    constructor(public dialog: MatDialog, private calendar: CalendarService) { }
    ngOnInit(): void {
        this.calendar.getCalendarEvents().then((list: Appointment[]) => {
            this.events = list.map((appointment: Appointment) => {

                let event: CalendarEvent = {
                    start: new Date(appointment.start),
                    end: new Date(appointment.end),
                    title: '',
                    color: calColor.grey,
                    actions: this.actions,
                }
                return event;
            })

        })

    }

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
    events: CalendarEvent[] = [
        // {
        //     start: new Date('2020-10-23 15:00'),
        //     end: new Date('2020-10-23 15:30'),
        //     title: '',
        //     color: calColor.red,
        //     actions: this.actions,
        //     // allDay: true,
        //     // resizable: {
        //     //     beforeStart: true,
        //     //     afterEnd: true,
        //     // },
        //     // draggable: true,
        // },
        // {
        //     start: new Date('2020-10-23 14:00'),
        //     end: new Date('2020-10-23 14:30'),
        //     title: '',
        //     color: calColor.yellow,
        //     actions: this.actions,
        //     // resizable: {
        //     //     beforeStart: true,
        //     //     afterEnd: true,
        //     // },
        //     // draggable: true,
        // },
        // {
        //     start: addHours(new Date(), 2),
        //     end: addHours(new Date(), 3),
        //     title: 'A draggable and resizable event',
        //     color: calColor.yellow,
        //     actions: this.actions,
        //     resizable: {
        //         beforeStart: true,
        //         afterEnd: true,
        //     },
        //     draggable: true,
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

    handleEvent(action: string, event: CalendarEvent): void {
        let modalData = { event, action };
        console.log("handleEvent: ", modalData)

        const dialogRef = this.dialog.open(CalendarModalComponent, {
            width: '998px',
            maxWidth: '90%',
            data: modalData
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }
    hourSegmentClicked(event) {
        let newEvent: CalendarEvent = {
            start: new Date(event.date),
            end: addHours(new Date(event.date), 1),
            title: '',
            color: calColor.yellow,
            actions: this.actions,
            draggable: true,
        }
        this.events = [...this.events, newEvent]
        console.log("hourSegmentClicked", this.events)
    }
    beforeViewRender(event) {
        // console.log("beforeViewRender", event)
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
