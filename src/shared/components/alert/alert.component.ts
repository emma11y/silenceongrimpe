import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  hasDisplay: boolean = false;
  class: string = '';
  icon: string = '';
  message: string = '';

  show(type: string, message: string) {
    switch (type) {
      case 'info':
        this.icon = 'fa-solid fa-circle-info';
        this.class = 'alert-info';
        break;
      case 'success':
        this.icon = 'fa-solid fa-circle-check';
        this.class = 'alert-success';
        break;
      case 'error':
        this.icon = 'fa-solid fa-circle-exclamation';
        this.class = 'alert-error';
        break;
      default:
        return;
    }

    this.message = message;
    this.hasDisplay = true;

    setTimeout(() => this.onDeleteAlert(), 3000);
  }

  onDeleteAlert() {
    this.hasDisplay = false;
    this.class = '';
    this.icon = '';
    this.message = '';
  }
}
