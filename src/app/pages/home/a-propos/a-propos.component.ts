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
      img: '../../../assets/imgs/logos/Logo-FEM.png',
      alt: 'Logo Femmes en montagne - festival de films',
      quote: 'Merci infiniment pour votre accompagnement !',
      subtitle:
        '<p class="italic">"Sans Silence, on grimpe !, nous n’aurions jamais eu l’idée de nous pencher sur cette thématique."</p>',
      html: `<p class="italic">"Je me souviens encore de ma première rencontre avec Arnaud lors du Salon de l’Escalade, où il est venu, avec beaucoup de pédagogie, m’expliquer l’enjeu de rendre un événement tel que notre festival de films accessible au public sourd et malentendant.</p><p class="italic">Il est vrai que nous n’avions jamais envisagé cette question auparavant. Grâce à son accompagnement et à l’aide de bénévoles engagés, nous avons pu, dès la première année, proposer une soirée accessible, avec des films sous-titrés et des échanges sur scène interprétés en langue des signes française. Depuis, toutes les projections des films en compétition sont accessibles : films sous-titrés, accueil des personnes sourdes et malentendantes, et interprétation en direct des échanges sur scène.</p><p class="italic">Sans Silence, on grimpe !, nous n’aurions sans doute jamais eu l’idée de nous pencher sur cette thématique. Nous leur sommes infiniment reconnaissants de nous avoir accompagnés pour rendre cette démarche la plus aboutie possible, en tenant compte du temps bénévole de notre association et des contraintes budgétaires."</p><p>Tanya Naville, Directrice du Festival de films Femmes en Montagne</p>`,
    },
    {
      id: 2,
      name: 'Festival du Cinéma Nature & Environnement',
      open: false,
      img: '../../../assets/imgs/logos/festival-logo-papillon.png',
      alt: 'Logo Festival du Cinéma Nature & Environnement',
      quote: 'Merci pour vos conseils.',
      subtitle: `<p class="italic">"Grâce aux conseils, nous avons vraiment franchi un cap en matière d'accessibilité ! En deux éditions, nous avons proposé 2 puis 3 séances entièrement sous-titrées. Merci pour cet accompagnement précieux !"</p><p>Marion Herbin-Sanz, chargée de communication France Nature Environnement Isère.</p>`,
    },
    {
      id: 3,
      name: `Festival International d'Autrans - Montagne, cinéma & culture`,
      open: false,
      img: '../../../assets/imgs/logos/festival-international-autrans-logo.png',
      alt: `Logo Festival International d'Autrans`,
      quote: 'Des conseils précieux !',
      subtitle: `<p class="italic">Le collectif Silence, on grimpe ! a permis à notre organisation de mettre un coup de projecteur sur la non-accessibilité des films et festivals aux personnes en situation de handicap.</p>`,
      html: `<p class="italic">Le collectif Silence, on grimpe ! a permis à notre organisation de mettre un coup de projecteur sur la non-accessibilité des films et festivals aux personnes en situation de handicap. L'énergie et la détermination du collectif nous ont poussé dans une réflexion positive afin de proposer des films à tous les publics, sans exception. J’apprécie particulièrement le procédé du collectif qui est de mettre les personnes non concernées en situation, comme celle d’écouter un film sans le son. C’est percutant et révoltant de voir que le cinéma est une telle frustration pour les personnes en situation de handicap. Nous ne pouvions rester inactifs sur ce sujet. C'est pourquoi le Festival d’Autrans a fait des démarches en ce sens et propose depuis 2023 des films pour tous les publics. Ce programme est perfectible. Mais une chose est sûre, l'accompagnement de Silence, on grimpe ! nous est précieux par ses conseils et ses piqûres de rappel. Merci à eux.</p><p>Anne Farrer, Directrice du Festival International d’Autrans - Montagne, cinéma & culture</p>`,
    },
  ];
}
