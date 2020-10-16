import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    menu = [
        {
            label: "autenticacion",
            path: "/authuser"
        },
        {
            label: "Pacientes",
            path: "/patients"
        },
        {
            label: "Profesionales",
            path: "/profesionals"
        },
        {
            label: "Administradores",
            path: "/admins"
        },
    ]
}
