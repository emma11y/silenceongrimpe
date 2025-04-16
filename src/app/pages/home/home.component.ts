import { Component } from '@angular/core';
import { CarrouselComponent } from '../../../shared/components/carrousel/carrousel.component';
import { CollectifComponent } from '../collectif/collectif.component';
import { TalkAboutUsComponent } from '../talk-about-us/talk-about-us.component';

@Component({
  selector: 'app-home',
  imports: [CarrouselComponent, CollectifComponent, TalkAboutUsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
