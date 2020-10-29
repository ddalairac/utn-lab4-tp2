import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarView, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { addDays, addHours, addMonths, addWeeks, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from 'date-fns';
import { Subject } from 'rxjs';
import { ClinicUser, Appointment, AttentionSpaces, Profesional, Specialties, iModalData } from '../../../../../class/data.model';
import { CalendarService, calColor } from '../../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../../services/fb-auth.service';
import { CalendarModalPatComponent } from '../calendar-modal-pat/calendar-modal-pat.component';

@Component({
    selector: 'app-calendar-pat',
    templateUrl: './calendar-pat.component.html',
    styleUrls: ['./calendar-pat.component.scss']
})
export class CalendarPatComponent implements OnInit,AfterViewInit{

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
    ngAfterViewInit(){
        this.disableHours()
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
    beforeViewRender(event: CalendarEvent) {
        // if (!this.dateIsValid(event.start)) {
        //     event.cssClass = 'cal-disabled';
        // }
        console.log("beforeViewRender", event)
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter((event) => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    // closeOpenMonthViewDay() {
    //     this.activeDayIsOpen = false;
    // }




    // TODO validar fecha

    disableHours() {
        let nodes: NodeListOf<Element> = document.querySelectorAll('.cal-day-columns');
        // let first = nodes[0];
        let sabado:Element = nodes[nodes.length - 1];
        console.log("ultima hora del sabado",sabado.querySelector('.cal-hour'))
    }


    // minDate: Date = addWeeks(new Date(), 1);

    // maxDate: Date = addWeeks(new Date(), 1);
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

    // dateIsValid(date: Date): boolean {
    //     return date >= this.minDate && date <= this.maxDate;
    // }
    // dateOrViewChanged(): void {
    //     this.prevBtnDisabled = !this.dateIsValid(
    //         endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
    //     );
    //     this.nextBtnDisabled = !this.dateIsValid(
    //         startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
    //     );
    //     if (this.viewDate < this.minDate) {
    //         this.changeDate(this.minDate);
    //     } else if (this.viewDate > this.maxDate) {
    //         this.changeDate(this.maxDate);
    //     }
    // }
    // changeDate(date: Date): void {
    //     this.viewDate = date;
    //     this.dateOrViewChanged();
    // }

    // changeView(view: CalendarPeriod): void {
    //     this.view = view;
    //     this.dateOrViewChanged();
    // }


}
// type CalendarPeriod = 'day' | 'week' | 'month';

// function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
//     return {
//         day: addDays,
//         week: addWeeks,
//         month: addMonths,
//     }[period](date, amount);
// }

// function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
//     return {
//         day: subDays,
//         week: subWeeks,
//         month: subMonths,
//     }[period](date, amount);
// }

// function startOfPeriod(period: CalendarPeriod, date: Date): Date {
//     return {
//         day: startOfDay,
//         week: startOfWeek,
//         month: startOfMonth,
//     }[period](date);
// }

// function endOfPeriod(period: CalendarPeriod, date: Date): Date {
//     return {
//         day: endOfDay,
//         week: endOfWeek,
//         month: endOfMonth,
//     }[period](date);
// }