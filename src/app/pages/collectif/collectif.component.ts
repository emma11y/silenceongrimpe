import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VideoGalleryComponent } from '@shared/components/video-gallery/video-gallery.component';

@Component({
  selector: 'app-collectif',
  imports: [VideoGalleryComponent, RouterLink],
  templateUrl: './collectif.component.html',
  styleUrl: './collectif.component.scss',
})
export class CollectifComponent {
  membres = [
    {
      img: 'Arnaud.webp',
      prenom: 'Arnaud',
      titre: 'Fondateur et coordinateur',
    },
    {
      img: 'Camille.webp',
      prenom: 'Camille',
      titre: 'Infographiste',
    },
    {
      img: 'Celine.webp',
      prenom: 'Céline',
      titre: 'Spécialiste sous-titrage',
    },
    {
      img: 'Emmanuelle.webp',
      prenom: 'Emmanuelle',
      titre: 'Web et spécialiste numérique',
    },
    {
      img: 'Helene.webp',
      prenom: 'Hélène',
      titre: 'Spécialiste data',
    },
    {
      img: 'Julie.webp',
      prenom: 'Julie',
      titre: 'Spécialiste LSF',
    },
    {
      img: 'Marion.webp',
      prenom: 'Marion',
      titre: 'Communication',
    },
    {
      img: 'Maude.webp',
      prenom: 'Maude',
      titre: 'Spécialiste Montage Ciné',
    },
    {
      img: 'Zehra.webp',
      prenom: 'Zehra',
      titre: 'Détectives',
    },
  ];
}
