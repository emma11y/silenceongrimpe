import { Component } from '@angular/core';

@Component({
  selector: 'app-membres-collectif',
  imports: [],
  templateUrl: './membres-collectif.component.html',
  styleUrl: './membres-collectif.component.scss',
})
export class MembresCollectifComponent {
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
