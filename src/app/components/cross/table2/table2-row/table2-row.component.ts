import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { iTableAction } from '../../table/table.model';

@Component({
    selector: 't2-row',
    templateUrl: './table2-row.component.html',
    styleUrls: ['./table2-row.component.scss']
})
export class Table2RowComponent implements OnInit {

    constructor() { }

    
    @Input() obj: any;
    @Input() objSelected: any;
    @Input() index: number;
    @Input() actions: iTableAction[] = [];
    // objSelected: any;
    @Output() selection: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(): void {
    }

    public onSelect(obj: any) {
        if (this.actions.length == 0) {
            this.objSelected = obj;
            this.selection.emit(obj)
            console.log("objSelected", this.objSelected)
        }
    }
}
