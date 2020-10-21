import { Component, OnInit } from '@angular/core';
import { Specialties } from '../../../../class/data.model';
import { eCollections } from '../../../../class/firebase.model';
import { FbStorageService } from '../../../../services/fb-storage.service';
import { iTableAction, iTableEvent } from '../../../cross/table/table.model';

@Component({
    selector: 'app-specialties-list',
    templateUrl: './specialties-list.component.html',
    styleUrls: ['./specialties-list.component.scss']
})
export class SpecialtiesListComponent implements OnInit {

    constructor(private fbsorageservice: FbStorageService) { }

    ngOnInit(): void {
        this.fbsorageservice.readAll(eCollections.specialties).then((list) => { this.specialtiesList = list; console.log(list) })
    }
    specialtiesList: Specialties[] = []
    actions: iTableAction[] = [
        {
            description: "editar",
            icon: "fas fa-edit",
            event: "editar"
        }, {
            description: "borrar",
            icon: "fas fa-times",
            event: "borrar"
        }
    ]
    onTableEvent(event:iTableEvent) {
        console.log("event",event)
    }
}
