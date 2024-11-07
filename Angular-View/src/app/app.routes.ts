import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NavbarAdminComponent } from './Components/navbar-admin/navbar-admin.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { OperationTypesComponent } from './Components/operation-types/operation-types.component';
import { CreateOperationTypeComponent } from './Components/operation-types/create-operation-type/create-operation-type.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { Hospital3dComponent } from './Components/hospital3d/hospital3d.component';

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
        path: "operation-types", component: OperationTypesComponent, children: [
            { path: "create-operation-type", component: CreateOperationTypeComponent }
        ]
    },

    {
      //  path: "hospital3d", component: Hospital3dComponent
    },
    
    {
        path: "", component: HomeComponent
    },
    {
        path: "**", component: NotFoundComponent
    }
    
];

@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [RouterModule.forRoot(routes),
        FormsModule,
        BrowserModule,
        HttpClientModule
        
    ],
    providers: [LoginService]
})
export class AppRoutingModule { }
