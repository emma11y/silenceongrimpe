import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-a-propos',
  imports: [NgClass, NgIf],
  templateUrl: './a-propos.component.html',
  styleUrl: './a-propos.component.scss',
})
export class AProposComponent {
  temoignages = [
    {
      id: 1,
      name: 'Ciné Montagne',
      open: false,
      img: '../../../assets/imgs/cine-montagne.png',
      alt: '24ème rencontres Ciné Montagne Grenoble Palais des sports 8-12 novembre 2022',
      quote: 'Super !',
      subtitle: "Un plaisir de travailler avec nous parce qu'on a des cookies.",
      html: '',
    },
    {
      id: 2,
      name: 'Montagne en scène',
      open: false,
      img: '../../../assets/imgs/montagne-en-scene-logo.png',
      alt: 'Logo Montagne en scène',
      quote: 'Wonderfull !',
      subtitle:
        "Un plaisir de travailler avec nous parce qu'on a vraiment des superbes cookies.",
      html: '',
    },
    {
      id: 3,
      name: 'Femmes en montagne',
      open: false,
      img: '../../../assets/imgs/Logo-FEM.png',
      alt: 'Femmes en montagne - festival de films',
      quote: 'Merci infiniment pour votre accompagnement !',
      subtitle:
        'Sans Silence on Grimpe, nous n’aurions jamais eu l’idée de nous pencher sur cette thématique.',
      html: `<p class="italic">"Je me souviens encore de ma première rencontre avec Arnaud lors du Salon de l’Escalade, où il est venu, avec beaucoup de pédagogie, m’expliquer l’enjeu de rendre un événement tel que notre festival de films accessible au public sourd et malentendant.</p><p class="italic">Il est vrai que nous n’avions jamais envisagé cette question auparavant. Grâce à son accompagnement et à l’aide de bénévoles engagés, nous avons pu, dès la première année, proposer une soirée accessible, avec des films sous-titrés et des échanges sur scène interprétés en langue des signes française. Depuis, toutes les projections des films en compétition sont accessibles : films sous-titrés, accueil des personnes sourdes et malentendantes, et interprétation en direct des échanges sur scène.</p><p class="italic">Sans Silence on Grimpe, nous n’aurions sans doute jamais eu l’idée de nous pencher sur cette thématique. Nous leur sommes infiniment reconnaissants de nous avoir accompagnés pour rendre cette démarche la plus aboutie possible, en tenant compte du temps bénévole de notre association et des contraintes budgétaires."</p><p>Tanya Naville, Directrice du Festival de films Femmes en Montagne</p>`,
    },
  ];
}
