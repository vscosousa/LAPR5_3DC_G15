import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../Services/dashboard.service';
import { SettingsService } from '../../Services/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  dashboardId: string = '';
  settingsId: string = '';

  constructor(private dashboardService: DashboardService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.dashboardService.dashboardId$.subscribe(dashboardId => {
      this.dashboardId = dashboardId;
    });

    this.settingsService.settingsId$.subscribe(settingsId => {
      this.settingsId = settingsId;
    });
  }

  logout() {
    localStorage.removeItem('token');
  }
}
