import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/pages/admin/admin.component';
import { ProfesionalsListComponent } from './components/pages/admin/profesionals-list/profesionals-list.component';
import { SpecialtiesListComponent } from './components/pages/admin/specialties-list/specialties-list.component';
import { AuthUserComponent } from './components/pages/auth-user/auth-user.component';
import { Error404Component } from './components/pages/error404/error404.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AttentionSurveyComponent } from './components/pages/patients/attention-survey/attention-survey.component';
import { PatientsComponent } from './components/pages/patients/patients.component';
import { ClinicHistoryFormComponent } from './components/pages/profecionals/clinic-history-form/clinic-history-form.component';
import { ProfecionalsComponent } from './components/pages/profecionals/profecionals.component';
import { UrlValidateService } from './services/url-validate.service';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { UsersListComponent } from './components/pages/admin/users-list/users-list.component';
import { ValidateEmailComponent } from './components/pages/auth-user/validate-email/validate-email.component';
import { NewUserComponent } from './components/pages/admin/users-list/new-user/new-user.component';
import { AppointmentsPatComponent } from './components/pages/patients/appointments-pat/appointments-pat.component';
import { AppointmentsProComponent } from './components/pages/profecionals/appointments-pro/appointments-pro.component';

const routes: Routes = [
    { path: 'authuser', component: AuthUserComponent },
    { path: 'validate-email', component: ValidateEmailComponent },
    { path: 'validate-email', component: ValidateEmailComponent },
    {
        path: 'patients', component: PatientsComponent, canActivate: [UrlValidateService], children: [
            { path: 'appointments', component: AppointmentsPatComponent },
            { path: 'appointmentSurvey', component: AttentionSurveyComponent },
            { path: '', redirectTo: 'appointmentList', pathMatch: 'full' }
        ]
    }, {
        path: 'profesionals', component: ProfecionalsComponent, canActivate: [UrlValidateService], children: [
            { path: 'appointments', component: AppointmentsProComponent },
            { path: 'clinicHistory', component: ClinicHistoryFormComponent },
            { path: '', redirectTo: 'appointmentList', pathMatch: 'full' }
        ]
    }, {
        path: 'admins', component: AdminComponent, canActivate: [UrlValidateService], children: [
            { path: 'users', component: UsersListComponent },
            { path: 'user-new', component: NewUserComponent },
            { path: 'profesionalsList', component: ProfesionalsListComponent },
            { path: 'specialtiesList', component: SpecialtiesListComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' }
        ]
    },
    { path: 'profile', component: ProfileComponent, canActivate: [UrlValidateService] },
    { path: 'home', component: HomeComponent, canActivate: [UrlValidateService] },
    { path: '', redirectTo: 'authuser', pathMatch: 'full' },
    { path: '**', component: Error404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
