import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PopupButton } from '@shared/models/popup-button';
import { trapFocusElements } from '@shared/utilities/accessibility.utility';

@Component({
  selector: 'app-popup',
  standalone: true,
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  //public opened: boolean = false;
  public title: string = '';
  public message: string = '';
  public buttons: PopupButton[] = [];

  @ViewChild('popup', { static: true })
  public popup!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {}

  public onShow(title: string, message: string, buttons: PopupButton[] = []) {
    if (this.popup) {
      this.title = title;
      this.message = message;
      this.buttons = buttons;

      this.popup.nativeElement.showModal();
    }
  }

  public onClose() {
    // this.opened = false;
    this.title = '';
    this.message = '';
    this.popup.nativeElement.close();
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: any) {
    if (event.key === 'Tab') {
      const focusedElement = document.activeElement;
      trapFocusElements(focusedElement, 'button', event.shiftKey);
      return;
    }
  }
}
