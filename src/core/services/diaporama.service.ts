import { Injectable } from '@angular/core';
import diaporama from '@referentiels/diaporama.json';
import { CarouselItem } from '@shared/models/carousel-item';

@Injectable({
  providedIn: 'root',
})
export class DiaporamaService {
  public getDiaporama(): CarouselItem[] {
    return diaporama.filter(
      (x) => x.hidden == false || x.hidden == undefined
    ) as unknown as CarouselItem[];
  }
}
