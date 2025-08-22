import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Type,
} from '@angular/core';
import { PopupComponentComponent } from '@shared/components/popup-component/popup-component.component';

@Injectable({
  providedIn: 'root',
})
export class PopupComponentService {
  private popupComponent!: PopupComponentComponent;

  setPopupComponent(popup: PopupComponentComponent) {
    this.popupComponent = popup;
  }

  open<T>(component: Type<T>, inputs?: Partial<T>): Promise<any> {
    return this.popupComponent.open(component, inputs).finally(() => {
      this.close();
    });
  }

  get componentRef() {
    return this.popupComponent.componentRef;
  }

  close(result?: any) {
    this.popupComponent.onClose(result);
  }
}
