import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { OperationTypesComponent } from './Components/operation-types/operation-types.component';
import { CreateOperationTypeComponent } from './Components/operation-types/create-operation-type/create-operation-type.component';
import { CreateStaffComponent } from './Components/create-staff/create-staff.component';
import { PatientSettingsComponent } from './Components/patient-settings/patient-settings.component';
import { AuthGuard } from './Guards/auth.guard';
import { UpdateOperationTypeComponent } from './Components/operation-types/update-operation-type/update-operation-type.component';
import { Hospital3dComponent } from './Components/hospital3d/hospital3d.component';
import { DeleteUserComponent } from './Components/delete-user/delete-user.component';
import { SearchStaffsComponent } from './Components/search-staffs/search-staffs.component';
import { PatientGuard } from './Guards/patient.guard';
import { PanelAdminComponent } from './Components/panel-admin/panel-admin.component';
import { UpdateStaffComponent } from './Components/update-staff/update-staff.component';
import { PatientPanelComponent } from './Components/patient-panel/patient-panel.component';
import { ManagePatientsComponent } from './Components/manage-patients/manage-patients.component';
import { CreatePatientComponent } from './Components/create-patient/create-patient.component';
import { ActivatePatientUserComponent } from './Components/activate-patient-user/activate-patient-user.component';
import { ConfirmUpdatesStaffComponent } from './Components/confirm-updates-staff/confirm-updates-staff.component';
import { UpdatePatientComponent } from './Components/update-patient/update-patient.component';
import { ViewAvailabilityComponent } from './Components/view-availability/view-availability.component';
import { ActiveStaffComponent } from './Components/active-staff/active-staff.component';
import { DoctorGuard } from './Guards/doctor.guard';
import { DoctorPanelComponent } from './Components/doctor-panel/doctor-panel.component';
import { OperationRequestsComponent } from './Components/operation-requests/operation-requests.component';
import { CreateOperationRequestComponent } from './Components/operation-requests/create-operation-request/create-operation-request.component';
/**import { UpdateOperationRequestComponent } from './Components/operation-requests/update-operation-request/update-operation-request.component';*/
import { SpecializationComponent } from './Components/specialization/specialization.component';
import { CreateSpecializationComponent } from './Components/specialization/create-specialization/create-specialization.component';
import { ManageAllergiesAndConditionsComponent } from './Components/manage-allergies-and-conditions/manage-allergies-and-conditions.component';
import { CreateAllergiesComponent } from './Components/manage-allergies-and-conditions/create-allergies/create-allergies.component';
import { CreateConditionsComponent } from './Components/manage-allergies-and-conditions/create-conditions/create-conditions.component';
import { UpdateAllergiesComponent } from './Components/manage-allergies-and-conditions/update-allergies/update-allergies.component';
import { UpdateConditionsComponent } from './Components/manage-allergies-and-conditions/update-conditions/update-conditions.component';
import { UpdateMedicalHistoryComponent } from './Components/update-medical-history/update-medical-history.component';
import { MedicalHistoryManagerComponent } from './Components/medical-history-manager/medical-history-manager.component';
import { PatientPolicyComponent } from './Components/patient-policy/patient-policy.component';
import { UpdateOperationRequestComponent } from './Components/operation-requests/update-operation-request/update-operation-request.component';
import { CreateAppointmentComponent } from './Components/create-appointment/create-appointment.component';
import { AppointmentManagerComponent } from './Components/appointment-manager/appointment-manager.component';
import { UpdateAppointmentComponent } from './Components/update-appointment/update-appointment.component';

export const routes: Routes = [
  {
    path: "register", component: RegisterComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'update-staff/ConfirmUpdates', component: ConfirmUpdatesStaffComponent
  },
  {
    path: 'activate', component: ActiveStaffComponent
  },
  {
    path: "panel-admin", component: PanelAdminComponent, canActivate: [AuthGuard]
  },
  {
    path: "panel-doctor", component: DoctorPanelComponent, canActivate: [DoctorGuard]
  },
  {
    path: "create-staff", component: CreateStaffComponent, canActivate: [AuthGuard]
  },
  {
    path: "search-staffs", component: SearchStaffsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'update-staff/:id', component: UpdateStaffComponent, canActivate: [AuthGuard]
  },
  {
    path: 'view-availability/:id', component: ViewAvailabilityComponent, canActivate: [AuthGuard]
  },
  {
    path: "operation-types", component: OperationTypesComponent, canActivate: [AuthGuard]
  },
  {
    path: "specializations", component: SpecializationComponent, canActivate: [AuthGuard], children: [
      { path: "create-specialization", component: CreateSpecializationComponent, canActivate: [AuthGuard] },
      { path: "update-specialization/:id", component: CreateSpecializationComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: "update-operation-type/:name", component: UpdateOperationTypeComponent, canActivate: [AuthGuard]
  },
  {
    path: "create-operation-type", component: CreateOperationTypeComponent, canActivate: [AuthGuard]
  },
  {
    path: "patient-panel", component: PatientPanelComponent, canActivate: [PatientGuard]
  },
  {
    path: "patient-settings", component: PatientSettingsComponent, canActivate: [PatientGuard]
  },
  {
    path: "patient-policy", component: PatientPolicyComponent
  },
  {
    path: "hospital3d", component: Hospital3dComponent
  },
  {
    path: "delete-user", component: DeleteUserComponent
  },
  {
    path: "manage-patients", component: ManagePatientsComponent, canActivate: [AuthGuard]
  },
  {
    path: "create-patient", component: CreatePatientComponent, canActivate: [AuthGuard]
  },
  {
    path: "activate-patient-user", component: ActivatePatientUserComponent
  },
  {
    path: "update-patient/:medicalRecordNumber", component: UpdatePatientComponent, canActivate: [AuthGuard]
  },
  {
    path: "operation-requests", component: OperationRequestsComponent, canActivate: [AuthGuard]
  },
  {
    path: "create-operation-request", component: CreateOperationRequestComponent, canActivate: [AuthGuard]
  },
  {
    path: "update-operation-request/:id", component: UpdateOperationRequestComponent, canActivate: [AuthGuard]
  },
  {
    path: "manage-allergies-and-conditions", component: ManageAllergiesAndConditionsComponent, canActivate: [AuthGuard], children: [
      {path: "create-allergies", component: CreateAllergiesComponent, canActivate: [AuthGuard]},
      {path: "create-conditions", component: CreateConditionsComponent, canActivate: [AuthGuard]},
      {path: "update-allergies/:id", component: UpdateAllergiesComponent, canActivate: [AuthGuard]},
      {path: "update-conditions/:id", component: UpdateConditionsComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path: "update-medical-history/:medicalRecordNumber", component: UpdateMedicalHistoryComponent, canActivate: [DoctorGuard]
  },
  {
    path: "medical-history-manager", component: MedicalHistoryManagerComponent, canActivate: [DoctorGuard]
  },
  {
    path: "create-appointment/:id", component: CreateAppointmentComponent, canActivate: [AuthGuard]
  },
  {
    path: "appointment-manager", component: AppointmentManagerComponent, canActivate: [AuthGuard]
  },
  {
    path: "update-appointment/:id", component: UpdateAppointmentComponent, canActivate: [AuthGuard]
  },
  {
    path: "", component: HomeComponent
  },
  {
    path: "**", component: NotFoundComponent
  }

];
