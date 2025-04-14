import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CarouselItem } from '../../models/carousel-item';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-carrousel',
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.scss',
})
export class CarrouselComponent implements OnInit {
  // elements
  @ViewChild('tabsEl', { static: true })
  public tabsEl!: TemplateRef<HTMLDivElement>;

  @ViewChild('carouselEl', { static: true })
  public carouselEl!: TemplateRef<HTMLDivElement>;

  //data
  public carousels: CarouselItem[] = [];
  public timeInterval = 1500;

  // states
  public hasFocusTabs: boolean = false;
  public hasFocusCarousel: boolean = false;
  public isPlaying: boolean = false;
  public disableControlButtons: boolean = false;

  //#region LIFE CYCLES

  public ngOnInit(): void {
    this.carousels = [
      {
        id: 1,
        title: 'Info super importante',
        subtitle:
          'Ils ont sauté le pas ! \n Découvrez la liste des festivals accessibles.',
        picture:
          'https://s3-alpha-sig.figma.com/img/bb17/e410/b21f81e9216a5995b3091bc944f0471b?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Yw11aFONGWjMGNvDVpsj87nsFZQjoj6SIM7FcMJkQePqyYjDWA61fHzOX~75dJhHR2Nl1yfckTxZAByb329nVbnVtd586uljE5rsJN7JBhOH2RbWIru7T1Au5UKB3iRHC5XwepusjOEIRT9QbEfBuBZYtLrLs~ysYnmwDIm-bVcZ~eXGurpvlvrwTMj9vg-TnvoYmzTp6F3hX17DQ7bbyNQqde-VSElP9T0NvVlNp3PZFhYh6K1l5sO0tl5x-ln4SRDcIedTcJ-~pSf5KaawvuPFpMSm-CA8VUsn-lV15bMtDWaOVXWYdn-YGFr-QTdAK8~r9xGFacT9p4UZPu-Yjw__',
        altPicture:
          "Un homme, avec son matériel d'escalade, escalade sur une montagne, regarde vers le bas et en arrière plan, on voit des montagnes enneigés.",
        selected: true,
      },
      {
        id: 2,
        title: 'Travel to Southwest England and Paris',
        subtitle: 'Sept. 14 to Sept. 24 or 27',
        picture:
          'https://www.w3.org/WAI/content-images/wai-aria-practices/patterns/carousel/examples/images/lands-endslide__800x600.jpg',
        altPicture: `Land's End in Cornwall`,
        selected: false,
      },
      {
        id: 3,
        title: "Great Children's Programming on Public TV",
        picture:
          'https://www.w3.org/WAI/content-images/wai-aria-practices/patterns/carousel/examples/images/trustslide-2__800x600.jpg',
        altPicture:
          'Mom and daughter play Daniel Tiger game on notebook computer.',
        selected: false,
      },
      {
        id: 4,
        title: `Foyle’s War Revisited`,
        picture:
          'https://www.w3.org/WAI/content-images/wai-aria-practices/patterns/carousel/examples/images/foyleswarslide__800x600.jpg',
        altPicture:
          'A man in a suit and fedora and a woman with coiffed hair look sternly into the camera.',
        subtitle:
          '8 pm Sunday, March 8, on TV: Sneak peek at the final season.',
        selected: false,
      },
      {
        id: 5,
        title: 'Great Britain Vote: 7 pm Sat.',
        picture:
          'https://www.w3.org/WAI/content-images/wai-aria-practices/patterns/carousel/examples/images/britcomdavidslide__800x600.jpg',
        altPicture: 'British flag with WILL-TV host David Thiel.',
        selected: false,
      },
      {
        id: 6,
        title: 'Mid-American Gardener: Thursdays at 7 pm',
        picture:
          'https://www.w3.org/WAI/content-images/wai-aria-practices/patterns/carousel/examples/images/mag800-2__800x600.jpg',
        altPicture: 'Mid-American Gardener panelists on the set',
        subtitle: 'Watch the latest episodes.',
        selected: false,
      },
    ];
  }

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

  public onPlayOrPauseClick(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.rotateSlides();
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

    // If carousel is not playing, we give focus in carousel-tab for screen reader
    if (!this.isPlaying) {
      (
        document.querySelector('#carousel-tab-' + carouselToSelected.id) as any
      ).focus();
    }
  }

  private rotateSlides() {
    if (this.isPlaying) {
      this.setSelectedToNextTab();
      setTimeout(this.rotateSlides.bind(this), this.timeInterval);
    }
  }

  //#endregion
}
