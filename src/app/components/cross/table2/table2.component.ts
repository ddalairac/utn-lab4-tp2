import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iTableAction, iTableCol, iTableEvent } from './table2.model';

@Component({
    selector: 'c-table',
    templateUrl: './table2.component.html',
    styleUrls: ['./table2.component.scss']
})
export class Table2Component {

    @Input() objList: any[] = [];
    @Input() cols: iTableCol[] = [];
    @Input() actions: iTableAction[] = [];
    @Output() selection: EventEmitter<any> = new EventEmitter<any>();
    @Output() action: EventEmitter<iTableEvent> = new EventEmitter<iTableEvent>();
    // rows: any[];
    objSelected: any;
    sortBy: string;
    sortOrientation: boolean;
    private lastSortBy: string;
    constructor() { }

    public rowData(row: any): string[] {
        let datos: string[] = []
        this.cols.forEach(e => {
            if (row[e.key]) {
                datos.push(row[e.key]);
            } else {
                datos.push('');
            }
        });
        // console.log("datos", datos)
        return datos
    }
    public isImg(dato): boolean {
        if (typeof dato == 'string') {
            if (dato.includes('.jpg') || dato.includes('.jpeg') || dato.includes('.png') || dato.includes('.gif') || dato.includes('.svg')) {
                // console.log("img",dato)
                return true
            }
        }
        return false
    }
    public onSortByCol(col: string): void {
        col = col.split(" ").join("_")
        this.sortBy = col;

        if (this.lastSortBy != this.sortBy) {
            this.lastSortBy = this.sortBy;
            this.sortOrientation = true;
        } else {
            this.sortOrientation = !this.sortOrientation;
        }
        if (this.sortOrientation) {
            this.objList = this.objList.sort((a, b) => { return (a[col] < b[col]) ? -1 : 1 })
        } else {
            this.objList = this.objList.sort((a, b) => { return (a[col] > b[col]) ? -1 : 1 })
        }
    }
    public onSelect(obj: any) {
        if (this.actions.length == 0) {
            this.objSelected = obj;
            this.selection.emit(obj)
            // console.log("objSelected", this.objSelected)
        }
    }
    public onAction(action: string, index: number) {
        this.action.emit({ action: action, index: index });
    }
}
