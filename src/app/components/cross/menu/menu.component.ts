import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FbAuthService } from '../../../services/fb-auth.service';

@Component({
  selector: 'p1-menu',
  templateUrl: './menu.component.html',
  styles: [
  ]
})
export class MenuComponent implements OnInit {

    @Input() navLinks: iMenu;
    constructor(private route: ActivatedRoute, private fbauthservice: FbAuthService, private router: Router) {}

    public isLogged$: Subject<boolean>;

    ngOnInit() {
        this.isLogged$ = this.fbauthservice.isLogged$;
    }
    goToSection(url) {
        this.router.navigateByUrl(url);
    }
    singOut(){
        this.fbauthservice.singOut();
    }
}
export interface iMenu{
    label: string;
    path: string;
}