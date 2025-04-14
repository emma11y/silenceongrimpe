import { Component } from '@angular/core';
import { CarrouselComponent } from '../../../shared/components/carrousel/carrousel.component';

@Component({
  selector: 'app-home',
  imports: [CarrouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
