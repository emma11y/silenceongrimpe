import { orderBy } from 'lodash-es';
import { AgendaCarrouselComponent } from './agenda-carrousel/agenda-carrousel.component';
import { Component, inject } from '@angular/core';
import { CarrouselComponent } from '@shared/components/carrousel/carrousel.component';
import { CollectifComponent } from './collectif/collectif.component';
import { CarouselItem } from '@shared/models/carousel-item';
import { MembresCollectifComponent } from './membres-collectif/membres-collectif.component';
import { ContactComponent } from './contact/contact.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { Actualite } from '@shared/models/actualite';
import { ActivatedRoute } from '@angular/router';
import { ListeVideosComponent } from './liste-videos/liste-videos.component';

@Component({
  selector: 'app-home',
  imports: [
    CarrouselComponent,
    CollectifComponent,
    AProposComponent,
    MembresCollectifComponent,
    AgendaCarrouselComponent,
    ContactComponent,
    ListeVideosComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);

  public carousels: CarouselItem[] = [];

  constructor() {
    const actualites = this.route.snapshot.data[
      'actualites'
    ] as unknown as Actualite[];

    this.carousels = orderBy(actualites, (x) => x.datePublication, 'desc').map(
      (actu, index) => {
        return {
          id: actu.id,
          slug: actu.slug,
          guid: actu.vignetteId,
          title: actu.titre,
          subtitle: actu.courtDescription,
          selected: index === 0,
        } as CarouselItem;
      }
    );
  }
}
