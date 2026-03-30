import { PostCarrouselComponent } from '@shared/components/post-carrousel/post-carrousel.component';
import { NgFor, NgClass } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { PostGrid } from '@shared/models/post-grid';
import { trapFocusElements } from '@shared/utilities/accessibility.utility';

@Component({
  selector: 'app-post-grid',
  imports: [NgFor, PostCarrouselComponent, NgClass],
  standalone: true,
  templateUrl: './post-grid.component.html',
  styleUrl: './post-grid.component.scss',
})
export class PostGridComponent {
  posts: PostGrid[] = [
    {
      id: 1,
      titre: 'Personne référente accessibilité',
      images: [
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/1.png',
          alt: 'Une personne référente accessibilité : la clé pour un festival inclusif et cohérent',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/2.png',
          alt: `Pas besoin d'un nouveau poste. Une personne déjà dans votre équipe peut se former aux différents handicaps et aux solutions inclusives adaptées à votre événement. Elle devient le point de contact privilégié sur toutes les questions d'accessibilité. Un véritable relais entre votre public, votre équipe et vos partenaires !`,
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/3.png',
          alt: `Avec une personne référente accessibilité, on évite ces exemples d'expériences désagréables... Plusieurs minutes pour trouver les infos d'accessibilité sur le site web de l'événement : mauvaise chasse au trésor. Programmer une séance avec seulement certains films sous-titrés : les personnes sourdes et malentendantes ne comprendront pas la moitié de la soirée... Le film est annoncé avec des sous-titres sur le programme mais erreur humaine : c'est une version sans sous-titrage qui est projetée...`,
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/4.png',
          alt: `Les missions de la personne référente accessibilité. 1) Identifier les besoins spécifiques du public 2) Coordonner les dispositifs : sous-titres, audiodescription, LSF, accès PMR... 3) Sensibiliser toute l'équipe (bénévoles, animateurs, accueil, etc.) pour garantir une expérience fluide et bienveillante.`,
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/5.png',
          alt: `Concrètement la personne référente accessibilité veille à ce que chaque personne puisse : entrer dans la salle sans obstracles, comprendre les films et les échanges et ressentir ensemble l'émition du cinéma. L'enjeu ? Faire de votre festival un lieu où tout le monde a sa place et où la magie du cinéma se partage vraiment !`,
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/6.png',
          alt: `Découvrez nos ressources sur www.silenceongrimpe.fr`,
        },
      ],
    },
    /* {
      id: 2,
      titre: 'Personne référente accessibilité',
      images: [
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/1.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/2.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/3.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/4.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/5.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/6.png',
          alt: '',
        },
      ],
    },
    {
      id: 3,
      titre: 'Personne référente accessibilité',
      images: [
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/1.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/2.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/3.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/4.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/5.png',
          alt: '',
        },
        {
          src: '../../../assets/imgs/posts/personne référente accessibilité/6.png',
          alt: '',
        },
      ],
    },*/
  ];

  isModalOpen = false;
  selectedIndex = 0;

  @ViewChild(PostCarrouselComponent)
  postCarrouselComponent: PostCarrouselComponent | undefined;

  openModal(index: number) {
    this.selectedIndex = index;
    this.isModalOpen = true;

    const element = document.querySelector('html');
    if (element) {
      element.style.overflow = 'hidden';
    }

    this.postCarrouselComponent?.initCarrousel();

    const dialogElement = document.querySelector("[role='dialog']");
    const focusedElement = document.activeElement;
    trapFocusElements(dialogElement, focusedElement, 'button', false);

    setTimeout(() => {
      const closeElement = dialogElement?.querySelector(
        '.close-button',
      ) as HTMLButtonElement;
      if (closeElement) {
        closeElement.focus();
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    const element = document.querySelector('html');
    if (element) {
      element.style.overflow = '';
    }

    const buttons = document.querySelectorAll('.post-item-button button');
    const currentButton = buttons[this.selectedIndex] as HTMLButtonElement;
    if (currentButton) {
      currentButton.focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    console.log('code', event.key);

    if (this.isModalOpen)
      if (event.key === 'Tab') {
        event.preventDefault();
        event.stopPropagation();

        const dialogElement = document.querySelector("[role='dialog']");
        const focusedElement = document.activeElement;
        trapFocusElements(dialogElement, focusedElement, 'button', false);
        return;
      }

    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
