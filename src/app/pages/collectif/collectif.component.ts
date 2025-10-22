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
      img: 'Arnaud.jpg',
      prenom: 'Arnaud',
      titre: 'Fondateur et coordinateur',
    },
    {
      img: 'Camille.jpg',
      prenom: 'Camille',
      titre: 'Infographiste',
    },
    {
      img: 'Celine.jpg',
      prenom: 'Céline',
      titre: 'Spécialiste sous-titrage',
    },
    {
      img: 'Emmanuelle.jpg',
      prenom: 'Emmanuelle',
      titre: 'Web et spécialiste numérique',
    },
    {
      img: 'Helene.jpg',
      prenom: 'Hélène',
      titre: 'Spécialiste data',
    },
    {
      img: 'Julie.jpg',
      prenom: 'Julie',
      titre: 'Spécialiste LSF',
    },
    {
      img: 'Marion.jpg',
      prenom: 'Marion',
      titre: 'Communication',
    },
    {
      img: 'Maude.jpg',
      prenom: 'Maude',
      titre: 'Spécialiste Montage Ciné',
    },
    {
      img: 'Zehra.jpg',
      prenom: 'Zehra',
      titre: 'Détectives',
    },
  ];
}
