import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NavbarAdminComponent } from './Components/navbar-admin/navbar-admin.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';

export const routes: Routes = [
    {
    path: 'login', component: LoginComponent
    },
    {
    path: "navbarAdmin", component: NavbarAdminComponent
    },
    {
    path: "register", component: RegisterComponent
    },
    {
    path: "", component: HomeComponent
    }
];
