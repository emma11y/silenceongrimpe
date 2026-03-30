import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  HostListener,
} from '@angular/core';
import { PostGrid } from '@shared/models/post-grid';
import { trapFocusElements } from '@shared/utilities/accessibility.utility';

@Component({
  selector: 'app-post-carrousel',
  imports: [NgFor, NgIf],
  standalone: true,
  templateUrl: './post-carrousel.component.html',
  styleUrl: './post-carrousel.component.scss',
})
export class PostCarrouselComponent {
  @Input() post!: PostGrid;
  @ViewChild('carousel', { static: false }) carousel:
    | ElementRef<HTMLDivElement>
    | undefined;

  currentIndex = 0;

  initCarrousel() {
    setTimeout(() => {
      this.goToImage(0);
    });
  }

  goToLeft(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.currentIndex > 0) this.goToImage(this.currentIndex - 1);
  }

  goToRight(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.currentIndex < this.post.images.length - 1)
      this.goToImage(this.currentIndex + 1);
  }

  goToImage(index: number) {
    if (this.carousel) {
      const el = this.carousel.nativeElement;
      el.scrollTo({
        left: el.clientWidth * index,
        behavior: 'smooth',
      });
      this.currentIndex = index;
    }
  }

  @HostListener('window:keydown.arrowleft', ['$event'])
  @HostListener('window:keydown.arrowright', ['$event'])
  onKeydown(event: any) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (event.key === 'ArrowLeft') {
        this.goToLeft(event);
      } else {
        this.goToRight(event);
      }
    }
  }
}
