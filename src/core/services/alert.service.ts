import { Injectable } from '@angular/core';
import { AlertComponent } from '@shared/components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertComponent!: AlertComponent;

  setAlertComponent(component: AlertComponent): void {
    this.alertComponent = component;
  }

  showAlert(type: string, message: string): void {
    if (this.alertComponent) {
      this.alertComponent.show(type, message);
    } else {
      console.error('AlertComponent non initialisé');
    }
  }
}
