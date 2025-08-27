import { AgendaCarrouselComponent } from './agenda-carrousel/agenda-carrousel.component';
import { Component, inject, OnInit } from '@angular/core';
import { CarrouselComponent } from '@shared/components/carrousel/carrousel.component';
import { CollectifComponent } from './collectif/collectif.component';
import { DiaporamaService } from '@core/services/diaporama.service';
import { CarouselItem } from '@shared/models/carousel-item';
import { MembresCollectifComponent } from './membres-collectif/membres-collectif.component';
import { ContactComponent } from './contact/contact.component';
import { AProposComponent } from './a-propos/a-propos.component';
import { SupabaseService } from '@core/services/supabase.service';
import { Actualite } from '@shared/models/actualite';

@Component({
  selector: 'app-home',
  imports: [
    CarrouselComponent,
    CollectifComponent,
    AProposComponent,
    MembresCollectifComponent,
    AgendaCarrouselComponent,
    ContactComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly supabase: SupabaseService = inject(SupabaseService);

  public carousels: CarouselItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this.supabase.getActualitesALaUne().then((result) => {
      if (result.data) {
        const actualites = result.data as unknown as Actualite[];

        this.carousels = actualites.map((actu, index) => {
          return {
            id: actu.id,
            slug: actu.slug,
            guid: actu.vignetteId,
            title: actu.titre,
            subtitle: actu.courtDescription,
            selected: index === 0,
          } as CarouselItem;
        });
      }
    });
  }
}
