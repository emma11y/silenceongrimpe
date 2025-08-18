import { Component, ViewChild } from '@angular/core';
import { ImageLibraryComponent } from '@shared/components/image-library/image-library.component';
import { PopupComponentComponent } from '@shared/components/popup-component/popup-component.component';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';

@Component({
  selector: 'app-bibliotheque-images',
  imports: [ImageLibraryComponent, PopupComponentComponent],
  templateUrl: './bibliotheque-images.component.html',
  styleUrl: './bibliotheque-images.component.scss',
})
export class BibliothequeImagesComponent {
  @ViewChild('popup') popup!: PopupComponentComponent;

  public async addImageClick(): Promise<void> {
    // ouvre HelloComponent dans le popup, avec un input
    const promise = this.popup.open(UploadImageComponent);

    // écoute l’événement `done` du composant enfant
    this.popup['componentRef']?.instance.outputClose.subscribe(() => {
      this.popup.onClose();
    });

    // attend le résultat du popup
    const res = await promise;
    console.log('Résultat reçu :', res);
  }
}
