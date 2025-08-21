import { Component } from '@angular/core';
import { ContactComponent } from '../home/contact/contact.component';

@Component({
  selector: 'app-page-contact',
  imports: [ContactComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class PageContactComponent {}
