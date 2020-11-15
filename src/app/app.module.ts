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
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PatientsComponent } from './components/pages/patients/patients.component';
import { ProfecionalsComponent } from './components/pages/profecionals/profecionals.component';
import { ClinicHistoryFormComponent } from './components/pages/profecionals/clinic-history-form/clinic-history-form.component';
import { AdminComponent } from './components/pages/admin/admin.component';
import { ProfesionalsListComponent } from './components/pages/admin/profesionals-list/profesionals-list.component';
import { SpecialtiesListComponent } from './components/pages/admin/specialties-list/specialties-list.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModalComponent } from './components/cross/calendar-modal/calendar-modal.component';
import { MainMenuComponent } from './components/cross/main-menu/main-menu.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { UsersListComponent } from './components/pages/admin/users-list/users-list.component';
import { TableComponent } from './components/cross/table/table.component';
import { Table2Component } from './components/cross/table2/table2.component';
import { ValidateEmailComponent } from './components/pages/auth-user/validate-email/validate-email.component';
import { NewUserComponent } from './components/pages/admin/users-list/new-user/new-user.component';
import { AppointmentsPatComponent } from './components/pages/patients/appointments-pat/appointments-pat.component';
import { CalendarPatComponent } from './components/pages/patients/appointments-pat/calendar-pat/calendar-pat.component';
import { CalendarModalPatComponent } from './components/pages/patients/appointments-pat/calendar-modal-pat/calendar-modal-pat.component';
import { AppointmentsProComponent } from './components/pages/profecionals/appointments-pro/appointments-pro.component';
import { CalendarProComponent } from './components/pages/profecionals/appointments-pro/calendar-pro/calendar-pro.component';
import { CalendarModalProComponent } from './components/pages/profecionals/appointments-pro/calendar-modal-pro/calendar-modal-pro.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { HttpClientModule } from '@angular/common/http';
import { ClinicHistoryModalProComponent } from './components/pages/profecionals/clinic-history-form/clinic-history-modal-pro/clinic-history-modal-pro.component';
import { NewAppointmentComponent } from './components/pages/patients/new-appointment/new-appointment.component';

@NgModule({
  declarations: [
    AppComponent,
    //cross
    GoBackComponent,
    LoaderComponent,
    MenuComponent,
    MainMenuComponent,
    TableComponent,
    Table2Component,
    CalendarModalComponent,
    // pages
    AuthUserComponent,
    LoginComponent,
    RegisterComponent,
    Error404Component,
    HomeComponent,
    AttentionSurveyComponent,
    PatientsComponent,
    ProfecionalsComponent,
    ClinicHistoryFormComponent,
    AdminComponent,
    ProfesionalsListComponent,
    SpecialtiesListComponent,
    ProfileComponent,
    UsersListComponent,
    ValidateEmailComponent,
    NewUserComponent,
    AppointmentsPatComponent,
    CalendarPatComponent,
    CalendarModalPatComponent,
    AppointmentsProComponent,
    CalendarProComponent,
    CalendarModalProComponent,
    ClinicHistoryModalProComponent,
    NewAppointmentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, // auth
    AngularFirestoreModule, // storage
    AngularFireStorageModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
