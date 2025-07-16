import { Injectable } from '@angular/core';
import { PopupComponent } from '@shared/components/popup/popup.component';
import { PopupButton } from '@shared/models/popup-button';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popupComponent!: PopupComponent;

  setPopupComponent(component: PopupComponent): void {
    this.popupComponent = component;
  }

  showPopup(title: string, message: string, buttons: PopupButton[] = []) {
    if (this.popupComponent) {
      this.popupComponent.onShow(title, message, buttons);
    } else {
      console.error('PopupComponent non initialisé');
    }
  }

  closePopup() {
    this.popupComponent.onClose();
  }
}
