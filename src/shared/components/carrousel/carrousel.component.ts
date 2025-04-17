import {
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CarouselItem } from '../../models/carousel-item';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DiaporamaService } from '@core/services/diaporama.service';

@Component({
  selector: 'app-carrousel',
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
})
export class CarrouselComponent implements OnInit {
  @Input() carousels: CarouselItem[] = [];

  private readonly diaporamaService: DiaporamaService =
    inject(DiaporamaService);

  // elements
  @ViewChild('tabsEl', { static: true })
  public tabsEl!: TemplateRef<HTMLDivElement>;

  @ViewChild('carouselEl', { static: true })
  public carouselEl!: TemplateRef<HTMLDivElement>;

  // states
  public hasFocusTabs: boolean = false;
  public hasFocusCarousel: boolean = false;

  //#region LIFE CYCLES

  public ngOnInit(): void {}

  //#endregion
  //#region EVENTS

  public onNextClick(): void {
    this.setSelectedToNextTab();
  }

  public onPreviousClick(): void {
    this.setSelectedToPreviousTab();
  }

  public onCarouselTabClick(carousel: CarouselItem): void {
    const carrouselSelected = this.carousels.find((x) => x.selected === true);
    if (carrouselSelected) {
      carrouselSelected.selected = false;
    }

    carousel.selected = true;
  }

  public onCarouselTabKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.setSelectedToPreviousTab();
        break;

      case 'ArrowRight':
        this.setSelectedToNextTab();
        break;
    }
  }

  //#endregion

  //#region FUNCTIONS

  private getCurrentIndex(): number {
    return this.carousels.findIndex((x) => x.selected === true);
  }

  private setSelectedToPreviousTab(): void {
    const currentIndex = this.getCurrentIndex();
    let previousIndex = currentIndex - 1;

    if (previousIndex === -1) {
      previousIndex = this.carousels.length - 1;
    }

    this.setSelectedTab(currentIndex, previousIndex);
  }

  private setSelectedToNextTab(): void {
    const currentIndex = this.getCurrentIndex();
    let nextIndex = currentIndex + 1;

    if (nextIndex === this.carousels.length) {
      nextIndex = 0;
    }

    this.setSelectedTab(currentIndex, nextIndex);
  }

  private setSelectedTab(oldIndex: number, newIndex: number): void {
    this.carousels[oldIndex].selected = false;

    let carouselToSelected = this.carousels[newIndex];
    carouselToSelected.selected = true;
  }

  //#endregion
}
