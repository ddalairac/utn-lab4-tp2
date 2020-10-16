import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'p1-loader',
  templateUrl: './loader.component.html',
  styles: [
  ]
})
export class LoaderComponent implements OnInit {

    public isLoading$: Subject<boolean> = this.loaderService.isLoading$;
    constructor(public loaderService: LoaderService) { }

    ngOnInit() {
        this.isLoading$ = this.loaderService.isLoading$;
    }
}
