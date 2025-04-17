import { Component, inject } from '@angular/core';
import { CarrouselComponent } from '@shared/components/carrousel/carrousel.component';
import { CollectifComponent } from './collectif/collectif.component';
import { TalkAboutUsComponent } from './talk-about-us/talk-about-us.component';
import { DiaporamaService } from '@core/services/diaporama.service';
import { CarouselItem } from '@shared/models/carousel-item';
import { MembresCollectifComponent } from './membres-collectif/membres-collectif.component';

@Component({
  selector: 'app-home',
  imports: [
    CarrouselComponent,
    CollectifComponent,
    TalkAboutUsComponent,
    MembresCollectifComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly diaporamaService: DiaporamaService =
    inject(DiaporamaService);

  public carousels: CarouselItem[] = [];

  constructor() {
    this.carousels = this.diaporamaService.getDiaporama();
  }
}
