import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AnimateGallery } from '../../../class/animations.component';
import { LoaderService } from '../../../services/loader.service';

@Component({
    selector: 'p1-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    animations: [AnimateGallery]
})
export class LoaderComponent implements OnInit {

    public isLoading$: Subject<boolean> = this.loaderService.isLoading$;
    constructor(public loaderService: LoaderService) { }
    state:string
    ngOnInit() {
        this.isLoading$ = this.loaderService.isLoading$;
        this.isLoading$.subscribe((loading:boolean) => {
            if(loading){
                this.state = "fadeIn"
            } else {
                this.state = "fadeOut"
            }
        })
    }
}
