import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../Services/dashboard.service';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.scss'
})
export class NavbarAdminComponent {

  constructor(private dashBoardService: DashboardService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.dashBoardService.setDashboardId('navbar-admin');
    

  }

}
