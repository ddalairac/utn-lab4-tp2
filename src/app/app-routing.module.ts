import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthUserComponent } from './components/pages/auth-user/auth-user.component';
import { Error404Component } from './components/pages/error404/error404.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AppointmentListPatComponent } from './components/pages/patients/appointment-list-pat/appointment-list-pat.component';
import { AppointmentNewPatComponent } from './components/pages/patients/appointment-new-pat/appointment-new-pat.component';
import { AttentionSurveyComponent } from './components/pages/patients/attention-survey/attention-survey.component';
import { PatientsComponent } from './components/pages/patients/patients.component';
import { UrlValidateService } from './services/url-validate.service';

const routes: Routes = [
    { path: 'authuser', component: AuthUserComponent },
    {
        path: 'patients', component: PatientsComponent, canActivate: [UrlValidateService], children: [
            { path: 'list', component: AppointmentListPatComponent },
            { path: 'new', component: AppointmentNewPatComponent },
            { path: 'survey', component: AttentionSurveyComponent },
        ]
    },
    { path: 'home', component: HomeComponent, canActivate: [UrlValidateService] },
    { path: '', redirectTo: 'authuser', pathMatch: 'full' },
    { path: '**', component: Error404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
