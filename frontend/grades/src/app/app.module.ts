import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { generalReducer } from './state/general.reducer';

import { AuthGuardService as AuthGuard } from './guards/auth-guard.service';
import { CreateClassComponent } from './dashboard/create-class/create-class.component';
import { SetGradeComponent } from './dashboard/set-grade/set-grade.component';
import { HomeDashboardComponent } from './dashboard/home-dashboard/home-dashboard.component';
import { SubsClassComponent } from './dashboard/subs-class/subs-class.component';
import { GetGradesComponent } from './dashboard/get-grades/get-grades.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'dashboard', component: DashboardComponent,
  children: [
    {
      path: '',
      children: [
        { path: 'create-class', component: CreateClassComponent },
        { path: 'set-grade', component: SetGradeComponent },
        { path: 'subs-class', component: SubsClassComponent  },
        { path: 'get-grades', component: GetGradesComponent },
        { path: '**', component: HomeDashboardComponent}
      ]
    }
  ], canActivate: [AuthGuard]},
  { path: '**', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreateClassComponent,
    SetGradeComponent,
    HomeDashboardComponent,
    SubsClassComponent,
    GetGradesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({applicationState: generalReducer})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
