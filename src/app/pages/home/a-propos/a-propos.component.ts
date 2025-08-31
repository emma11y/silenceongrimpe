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
      name: 'Femmes en montagne',
      open: false,
      img: '../../../assets/imgs/Logo-FEM.png',
      alt: 'Logo Femmes en montagne - festival de films',
      quote: 'Merci infiniment pour votre accompagnement !',
      subtitle:
        '<p class="italic">"Sans Silence on Grimpe, nous n’aurions jamais eu l’idée de nous pencher sur cette thématique."</p>',
      html: `<p class="italic">"Je me souviens encore de ma première rencontre avec Arnaud lors du Salon de l’Escalade, où il est venu, avec beaucoup de pédagogie, m’expliquer l’enjeu de rendre un événement tel que notre festival de films accessible au public sourd et malentendant.</p><p class="italic">Il est vrai que nous n’avions jamais envisagé cette question auparavant. Grâce à son accompagnement et à l’aide de bénévoles engagés, nous avons pu, dès la première année, proposer une soirée accessible, avec des films sous-titrés et des échanges sur scène interprétés en langue des signes française. Depuis, toutes les projections des films en compétition sont accessibles : films sous-titrés, accueil des personnes sourdes et malentendantes, et interprétation en direct des échanges sur scène.</p><p class="italic">Sans Silence on Grimpe, nous n’aurions sans doute jamais eu l’idée de nous pencher sur cette thématique. Nous leur sommes infiniment reconnaissants de nous avoir accompagnés pour rendre cette démarche la plus aboutie possible, en tenant compte du temps bénévole de notre association et des contraintes budgétaires."</p><p>Tanya Naville, Directrice du Festival de films Femmes en Montagne</p>`,
    },
    {
      id: 2,
      name: 'Festival du Cinéma Nature & Environnement',
      open: false,
      img: '../../../assets/imgs/festival-logo-papillon.png',
      alt: 'Logo Festival du Cinéma Nature & Environnement',
      quote: 'Merci pour vos conseils.',
      subtitle: `<p class="italic">"Grâce aux conseils, nous avons vraiment franchi un cap en matière d'accessibilité ! En deux éditions, nous avons proposé 2 puis 3 séances entièrement sous-titrées. Merci pour cet accompagnement précieux !"</p><p>Marion Herbin-Sanz, chargée de communication France Nature Environnement Isère.</p>`,
    },
  ];
}
