import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PanelService } from '../../Services/panel.service';
import { SettingsService } from '../../Services/settings.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelId: string = '';
  settingsId: string = '';
  name: string = '';
  role: string = '';

  constructor(private panelService: PanelService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.panelService.panelId$.subscribe(panelId => {
      this.panelId = panelId;
    });

    this.settingsService.settingsId$.subscribe(settingsId => {
      this.settingsId = settingsId;
    });

    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token:', token);
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      this.name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Name:', this.name);
      console.log('Role:', this.role);
    }
  }

  logout() {
    localStorage.removeItem('token');
  }
}

