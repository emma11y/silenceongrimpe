import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { trapFocusElements } from '@shared/utilities/accessibility.utility';

@Component({
  selector: 'app-popup-component',
  imports: [CommonModule, NgClass],
  templateUrl: './popup-component.component.html',
  styleUrl: './popup-component.component.scss',
})
export class PopupComponentComponent {
  @ViewChild('popup', { static: true })
  public popup!: ElementRef<HTMLDivElement>;

  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  public componentRef?: ComponentRef<any>;
  private resolveFn?: (value: any) => void;

  public opened: boolean = false;

  open<T>(component: Type<T>, inputs?: Partial<T>): Promise<any> {
    this.container.clear();
    this.componentRef = this.container.createComponent(component);

    if (inputs) {
      Object.assign(this.componentRef.instance, inputs);
    }

    this.opened = true;

    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  onClose(result?: any) {
    this.container.clear();
    this.componentRef?.destroy();
    this.resolveFn?.(result);
    this.resolveFn = undefined;
    this.opened = false;
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();

      const focusedElement = document.activeElement;
      trapFocusElements(
        this.popup.nativeElement,
        focusedElement,
        'button, input[type="text"], textarea',
        event.shiftKey
      );
      return;
    }
  }
}
