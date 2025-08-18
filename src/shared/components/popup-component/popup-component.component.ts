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

  private componentRef?: ComponentRef<any>;
  private resolveFn?: (value: any) => void;

  public opened: boolean = false;

  /** Affiche un composant dans le popup et retourne une promesse résolue à la fermeture */
  public async open<T>(component: Type<T>, inputs?: Partial<T>): Promise<any> {
    this.container.clear();
    this.componentRef = this.container.createComponent(component);

    // injecte les inputs
    if (inputs) {
      Object.assign(this.componentRef.instance, inputs);
    }

    this.opened = true;

    const closeBtn: HTMLButtonElement | null =
      document.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }

    // retourne une promesse qui se résout à la fermeture
    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  public onClose(result?: any) {
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
