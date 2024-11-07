import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NavbarAdminComponent } from './Components/navbar-admin/navbar-admin.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { OperationTypesComponent } from './Components/operation-types/operation-types.component';
import { CreateOperationTypeComponent } from './Components/operation-types/create-operation-type/create-operation-type.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { CreateStaffComponent } from './Components/create-staff/create-staff.component';

export const routes: Routes = [
    {
        path: "register", component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: "navbar-admin", component: NavbarAdminComponent
    },
    {
        path: "createStaff", component: CreateStaffComponent
    },
    {
        path: "operation-types", component: OperationTypesComponent, children: [
            { path: "create-operation-type", component: CreateOperationTypeComponent }
        ]
    },
    {
        path: "", component: HomeComponent
    },
    {
        path: "**", component: NotFoundComponent
    }

];
