import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';

export const routes: Routes = [
    {
    path: 'login', component: LoginComponent
    },
    {
    path: "navbarAdmin", component: NavbarAdminComponent
    },
];
