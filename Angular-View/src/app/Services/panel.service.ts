import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @class PanelService
 * @description Service to manage the panel ID state.
 * @vscosousa - 11/11/2024
 */
@Injectable({
  providedIn: 'root'
})
export class PanelService {
  /**
   * @constructor
   * @vscosousa - 11/11/2024
   */
  constructor() { }

  private panelIdSource = new BehaviorSubject<string>('default-panel');
  panelId$ = this.panelIdSource.asObservable();

  /**
   * Sets the panel ID.
   * @method setPanelId
   * @param {string} panelId - The panel ID to set.
   * @vscosousa - 09/11/2024
   */
  setPanelId(panelId: string) {
    this.panelIdSource.next(panelId);
  }
}
