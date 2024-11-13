import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  constructor() { }

  private panelIdSource = new BehaviorSubject<string>('default-panel');
  panelId$ = this.panelIdSource.asObservable();

  setPanelId(panelId: string) {
    this.panelIdSource.next(panelId);
  }
}
