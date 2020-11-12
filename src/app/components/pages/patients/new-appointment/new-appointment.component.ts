import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimateGallery } from '../../../../class/animations.component';
import { Appointment, AttentionSpaces, ClinicUser, eSpacesTypes, Profesional, Specialties } from '../../../../class/data.model';
import { CalendarService } from '../../../../services/calendar-service.service';
import { FbAuthService } from '../../../../services/fb-auth.service';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',
    styleUrls: ['./new-appointment.component.scss'],
    animations: [AnimateGallery]
})
export class NewAppointmentComponent implements OnInit {


    currentUser: ClinicUser
    profesionals: Profesional[];
    specialties: Specialties[];
    profesionalsFiltered: iProItm[];
    // selectAttentionSpace: AttentionSpaces;
    selectSpecialty: Specialties;
    selectProfesional: Profesional;
    newAppointment: Appointment;
    state1: eSteps = eSteps.accordionOpen;
    state2: eSteps;
    state3: eSteps;
    constructor(private calendar: CalendarService, private authservice: FbAuthService, private router:Router) { }

    ngOnInit(): void {
        this.authservice.userInfo$.subscribe((user: ClinicUser) => {
            this.currentUser = user;
            // console.log("current user appointment", user)
            this.calendar.setCalendarAppointments()
            this.getTablas();
        })
    }
    private async getTablas() {
        // this.calendar.getAttentionSpaces().then((list: AttentionSpaces[]) => { this.attentionSpaces = list })
        let speList: Specialties[] = await this.calendar.getSpecialties() //.then((list: Specialties[]) => { this.specialties = list; })
        let proList: Profesional[] = await this.calendar.getProfecionals().then((list: Profesional[]) => { this.profesionals = list; return list })
        if (speList && proList && speList.length > 0 && proList.length > 0) {
            this.filterSpecialities(speList, proList)
        } else {
            console.error("getTablas", speList, proList)
        }

    }
    public onSelectSpecialty(specialty: Specialties): void {
        this.selectSpecialty = specialty
        this.filterProfesionals(specialty.name)
        this.stepper(eNavSteps.go2)
    }
    public onSelectProfesional(profesional: iProItm): void {
        this.selectProfesional = profesional.meta;
        this.findClosestAppointment();
        this.stepper(eNavSteps.go3)
    }
    /** Devuelve las especialidates ejercercidas por algun medico de la lista */
    private filterSpecialities(speList: Specialties[], proList: Profesional[]) {
        // console.log("proList",proList)
        let specialties: Specialties[] = speList.filter((sp: Specialties) => {
            let enable = false
            proList.forEach((pro: Profesional) => {
                // console.log("specialties filter",pro.lastname, pro.specialty, sp.name, pro.specialty.includes(sp.name))
                if (pro.specialty.includes(sp.name)) {
                    enable = true
                }
            })
            // console.log("enable",enable)
            return enable;
        });
        // console.log("specialties filtered",specialties)
        this.specialties = specialties;
    }
    /** Devuelve los medicos ya habilitados por el admin a ejercer en la clinica */
    private filterProfesionals(specialty: string) {
        if (this.profesionals) {
            this.profesionalsFiltered = []
            this.profesionals.forEach((pro: Profesional) => {
                if (pro.estaAceptado && pro.specialty.includes(specialty)) {
                    let proItm: iProItm = {
                        name: pro.lastname + ", " + pro.name,
                        meta: pro
                    }
                    this.profesionalsFiltered.push(proItm)
                }
            });
        }

    }

    private async findClosestAppointment() {
        this.newAppointment = await this.calendar.getAvailableAppointment(this.selectProfesional, this.selectSpecialty.name, this.currentUser)
        console.log("findClosestAppointment", this.newAppointment)
    }
    onAceptAppointment(){
        this.calendar.createCalendarEvent(this.newAppointment);
        this.router.navigateByUrl('/home')
    }

    public stepper(goto: eNavSteps) {
        setTimeout(() => {
            // console.log("goto", goto)
            switch (goto) {
                case eNavSteps.go2:
                    this.state1 = eSteps.slideOutLeft
                    this.state2 = eSteps.slideInRight
                    break
                case eNavSteps.go3:
                    this.state2 = eSteps.slideOutLeft
                    this.state3 = eSteps.slideInRight
                    break
                case eNavSteps.back1:
                    this.state1 = eSteps.slideInLeft
                    this.state2 = eSteps.slideOutRight
                    this.selectSpecialty = null;
                    break
                case eNavSteps.back2:
                    this.state2 = eSteps.slideInLeft
                    this.state3 = eSteps.slideOutRight
                    this.selectProfesional = null;
                    // this.newAppointment = null;
                    break
            }
        }, 100);
    }
}

interface iProItm {
    name: string
    meta: Profesional
}
export enum eSteps {
    slideInLeft = "slideInLeft",
    slideOutLeft = "slideOutLeft",
    slideInRight = "slideInRight",
    slideOutRight = "slideOutRight",
    accordionOpen = "accordionOpen"
}
export enum eNavSteps {
    go2 = "go2",
    go3 = "go3",
    back1 = "back1",
    back2 = "back2"
}