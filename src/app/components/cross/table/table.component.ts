import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { iTableAction, iTableEvent } from './table.model';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {

    @Input() objList: any[];
    @Input() hideCols: string[] = ['id'];
    @Input() actions: iTableAction[] = [];
    @Output() selection: EventEmitter<any> = new EventEmitter<any>();
    @Output() action: EventEmitter<iTableEvent> = new EventEmitter<iTableEvent>();
    colNames: string[];
    objSelected: any;
    sortBy: string;
    sortOrientation: boolean;
    private lastSortBy: string;
    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        let list: any[] = changes.objList.currentValue
        if (list) {
            console.log("objList", list)
            this.colNames = this.setColNames(list)
        }
    }
    public setColNames(objList: any[]): string[] {
        let cols: string[] = []
        if (objList && objList[0]) {
            for (let col in objList[0]) {
                // console.log("col",col)
                if (!this.hideCols.includes(col)) {
                    col = col.split("_").join(" ")
                    cols.push(col)
                }
            }
        }
        cols = cols.sort()
        // console.log("cols",cols)
        return cols
    }
    public rowData(row: any): string[] {
        let datos: string[] = []
        // console.log("row", row)
        let aux = this.sortByKey(row)
        if (aux) {
            for (let col in aux) {
                // console.log("dato",row[dato])
                if (!this.hideCols.includes(col)) {
                    datos.push(aux[col])
                }
            }
        }
        // console.log("datos",datos)
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
    private sortByKey(obj): any {
        let sortObj: any = Object.entries(obj).sort().reduce((o, [k, v]) => (o[k] = v, o), {})
        // console.log("sort", sortObj)
        return sortObj
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
    public onAction(action: string, index: number, obj:any) {
        this.action.emit({ action: action, index: index, obj:obj });
    }
}
