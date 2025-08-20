import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AgendaItem } from './agenda-item';
import { filtrerPeriodes } from '@shared/utilities/period.utility';

@Component({
  selector: 'app-agenda-carrousel',
  imports: [NgIf],
  templateUrl: './agenda-carrousel.component.html',
  styleUrl: './agenda-carrousel.component.scss',
})
export class AgendaCarrouselComponent implements OnInit {
  private readonly supabaseService: SupabaseService = inject(SupabaseService);

  @ViewChild('viewport', { static: true })
  viewportRef!: ElementRef<HTMLDivElement>;
  @ViewChild('status', { static: true }) statusRef!: ElementRef<HTMLDivElement>;

  public index: number = 0;
  public items: AgendaItem[] = [];

  get total(): number {
    return this.items.length;
  }

  ngOnInit(): void {
    this.getEvenements();
  }

  /*ngAfterViewInit(): void {
    this.update();
    // navigation clavier ← →
    this.viewportRef.nativeElement.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.goTo(this.index - 1);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.goTo(this.index + 1);
        }
      }
    );
  }*/

  public isVisible(i: number): boolean {
    // Affiche l'élément courant et les deux suivants (pour desktop)
    // Pour mobile, tu peux ajuster à ±0 ou ±1
    if (window.innerWidth >= 900) {
      return i >= this.index && i < this.index + 3;
    }
    // Pour mobile, seulement l'élément courant
    return i === this.index;
  }

  public goTo(i: number): void {
    if (i < 0) i = this.total - 1;
    if (i >= this.total) i = 0;
    this.index = i;
    this.update();
  }

  private update(): void {
    if (!this.viewportRef || !this.viewportRef.nativeElement) {
      return;
    }

    /*const slides =
      this.viewportRef.nativeElement.querySelectorAll('.carousel__slide');
    if (slides[this.index]) {
      (slides[this.index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      });
    }*/
    if (this.statusRef) {
      this.statusRef.nativeElement.textContent = `Élément ${
        this.index + 1
      } sur ${this.total}`;
    }
  }

  private getEvenements() {
    this.supabaseService.getEvenements().then((result: any) => {
      if (result.data) {
        this.items = filtrerPeriodes(
          result.data as AgendaItem[]
        ) as AgendaItem[];

        this.items.forEach((item, index) => (item.index = index));
        this.items[0].selected = true;
        this.items[1].selected = true;
        this.items[2].selected = true;
      }
    });
  }

  onPreviousClick() {
    const itemsSelected = this.items.filter((x) => x.selected);
    if (itemsSelected[0].index === 0) {
      return;
    }

    if (itemsSelected.length === 3) {
      itemsSelected[2].selected = false;
    }
    const prevItem = this.items[itemsSelected[0].index - 1];
    if (prevItem) {
      prevItem.selected = true;
    }
  }

  onNextClick() {
    const itemsSelected = this.items.filter((x) => x.selected);

    if (itemsSelected.length === 1) {
      return;
    }

    itemsSelected[0].selected = false;
    const nextItem = this.items[itemsSelected[2].index + 1];
    if (nextItem) {
      nextItem.selected = true;
    }
  }
}
