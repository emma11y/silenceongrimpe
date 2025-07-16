import { AgendaComponent } from './agenda/agenda.component';
import { Component, inject } from '@angular/core';
import { CarrouselComponent } from '@shared/components/carrousel/carrousel.component';
import { CollectifComponent } from './collectif/collectif.component';
import { DiaporamaService } from '@core/services/diaporama.service';
import { CarouselItem } from '@shared/models/carousel-item';
import { MembresCollectifComponent } from './membres-collectif/membres-collectif.component';
import { ContactComponent } from './contact/contact.component';
import { AProposComponent } from './a-propos/a-propos.component';

@Component({
  selector: 'app-home',
  imports: [
    CarrouselComponent,
    CollectifComponent,
    AProposComponent,
    MembresCollectifComponent,
    AgendaComponent,
    ContactComponent,
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
