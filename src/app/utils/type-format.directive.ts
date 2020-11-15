import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[typeFormat]'
})
export class TypeFormatDirective implements AfterViewInit {

    constructor(private element: ElementRef) { }
    ngAfterViewInit() {
        console.log("innerText: ", this.element.nativeElement.innerText)
        let dato: string = this.element.nativeElement.innerText
        if (dato == 'true') {
            this.element.nativeElement.innerHTML = "<i class='fas fa-check'></i>"
        }
        if (dato == 'false') {
            this.element.nativeElement.innerHTML = "<i class='fas fa-times'></i>"
        }
        if (dato.includes('.jpg') || dato.includes('.jpeg') || dato.includes('.png') || dato.includes('.gif') || dato.includes('.svg')) {
            this.element.nativeElement.innerHTML = `<img src="${dato}" style="max-height: 40px; border-radius:20px">`
            this.element.nativeElement.style.padding = 0
            this.element.nativeElement.style.textAlign = 'center'
        }
    }
    // @HostListener('mouseenter') onMouseEnter() {
    //     console.log("inputColor: ", this.inputColor)
    //     if (this.inputColor) {
    //         this.element.nativeElement.style.backgroundColor = this.inputColor
    //     } else {
    //         this.element.nativeElement.style.backgroundColor = 'blue'
    //     }
    // }
    // @HostListener('mouseleave') onMouseLeave() {
    //     this.element.nativeElement.style.backgroundColor = 'white'
    // }
    // @Input('hoverColor') inputColor: string
}
// <p typeFormat hoverColor="red">{{bool}}</p>