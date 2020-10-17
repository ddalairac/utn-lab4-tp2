import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Error404Component } from './components/pages/error404/error404.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { GoBackComponent } from './components/cross/go-back/go-back.component';
import { LoaderComponent } from './components/cross/loader/loader.component';
import { MenuComponent } from './components/cross/menu/menu.component';
import { AuthUserComponent } from './components/pages/auth-user/auth-user.component';
import { LoginComponent } from './components/pages/auth-user/login/login.component';
import { RegisterComponent } from './components/pages/auth-user/registro/register.component';
import { MaterialModule } from './vendors/material.module';
import { AttentionSurveyComponent } from './components/pages/patients/attention-survey/attention-survey.component';
import { AppointmentNewPatComponent } from './components/pages/patients/appointment-new-pat/appointment-new-pat.component';
import { AppointmentListPatComponent } from './components/pages/patients/appointment-list-pat/appointment-list-pat.component';
import { PatientsComponent } from './components/pages/patients/patients.component';
import { ProfecionalsComponent } from './components/pages/profecionals/profecionals.component';
import { AppointmentListProComponent } from './components/pages/profecionals/appointment-list-pro/appointment-list-pro.component';
import { ClinicHistoryFormComponent } from './components/pages/profecionals/clinic-history-form/clinic-history-form.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { ProfesionalsListComponent } from './components/pages/admin/profesionals-list/profesionals-list.component';
import { SpecialtiesListComponent } from './components/pages/admin/specialties-list/specialties-list.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModalComponent } from './components/cross/calendar-modal/calendar-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    GoBackComponent,
    LoaderComponent,
    MenuComponent,
    AuthUserComponent,
    LoginComponent,
    RegisterComponent,
    Error404Component,
    HomeComponent,
    AttentionSurveyComponent,
    AppointmentNewPatComponent,
    AppointmentListPatComponent,
    PatientsComponent,
    ProfecionalsComponent,
    AppointmentListProComponent,
    ClinicHistoryFormComponent,
    AdminComponent,
    ProfesionalsListComponent,
    SpecialtiesListComponent,
    CalendarModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, // auth
    AngularFirestoreModule, // storage
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
