import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 't2-col',
    templateUrl: './table2-col.component.html',
    styleUrls: ['./table2-col.component.scss']
})
export class Table2ColComponent implements OnInit {

    constructor() { }
    @Input() colName: string
    @Input() dato: string
    ngOnInit(): void {
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
}
