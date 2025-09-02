import { Component } from '@angular/core';

@Component({
  selector: 'app-collectif',
  imports: [],
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
