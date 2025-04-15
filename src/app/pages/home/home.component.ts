import { Component } from '@angular/core';
import { CarrouselComponent } from '../../../shared/components/carrousel/carrousel.component';
import { CollectifComponent } from '../collectif/collectif.component';

@Component({
  selector: 'app-home',
  imports: [CarrouselComponent, CollectifComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
