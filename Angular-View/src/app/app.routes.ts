import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NavbarAdminComponent } from './Components/navbar-admin/navbar-admin.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { OperationTypesComponent } from './Components/operation-types/operation-types.component';
import { CreateOperationTypeComponent } from './Components/operation-types/create-operation-type/create-operation-type.component';
import { CreateStaffComponent } from './Components/create-staff/create-staff.component';
import { PatientDashboardComponent } from './Components/patient-dashboard/patient-dashboard.component';
import { PatientSettingsComponent } from './Components/patient-settings/patient-settings.component';
import { AuthGuard } from './Guards/auth.guard';
import { UpdateOperationTypeComponent } from './Components/operation-types/update-operation-type/update-operation-type.component';


export const routes: Routes = [
    {
        path: "register", component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: "navbar-admin", component: NavbarAdminComponent, canActivate: [AuthGuard]
    },
    {
        path: "createStaff", component: CreateStaffComponent
    },
    {
        path: "operation-types", component: OperationTypesComponent, canActivate: [AuthGuard]
    },
    {
        path: "update-operation-type/:name", component: UpdateOperationTypeComponent , canActivate: [AuthGuard]
    },
    {
        path: "create-operation-type", component: CreateOperationTypeComponent , canActivate: [AuthGuard]
    },
    {
        path: "patient-dashboard", component: PatientDashboardComponent
    },
    {
        path: "patient-settings", component: PatientSettingsComponent
    },
    {
        path: "", component: HomeComponent
    },
    {
        path: "**", component: NotFoundComponent
    }

];
