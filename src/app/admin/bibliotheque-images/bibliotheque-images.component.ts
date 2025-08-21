import {
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { ImageLibraryComponent } from '@shared/components/image-library/image-library.component';
import { PopupComponentComponent } from '@shared/components/popup-component/popup-component.component';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-bibliotheque-images',
  imports: [ImageLibraryComponent, PopupComponentComponent],
  templateUrl: './bibliotheque-images.component.html',
  styleUrl: './bibliotheque-images.component.scss',
})
export class BibliothequeImagesComponent implements OnInit {
  @Input() pick: boolean = false;
  @Output() outputClose: EventEmitter<Picture> = new EventEmitter<Picture>();

  @ViewChild('popup', { static: true }) popup!: PopupComponentComponent;

  public images: Picture[] = [];

  private readonly supabase: SupabaseService = inject(SupabaseService);

  public ngOnInit(): void {
    this.getImages();
  }

  public async addImageClick(): Promise<void> {
    // ouvre HelloComponent dans le popup, avec un input
    const promise = this.popup.open(UploadImageComponent);

    // écoute l’événement `done` du composant enfant
    this.popup['componentRef']?.instance.outputClose.subscribe(() => {
      this.popup.onClose();
      this.getImages();
    });

    await promise;
  }

  public async onDisplayImageClick(picture: Picture) {
    if (this.pick) {
      this.outputClose.emit(picture);
      return;
    }

    console.log(picture);

    const promise = this.popup.open(DisplayImageComponent, { picture });

    // écoute l’événement `done` du composant enfant
    this.popup['componentRef']?.instance.outputClose.subscribe(() => {
      this.popup.onClose();
    });

    await promise;
  }

  public getImages(): void {
    this.supabase.getImages().then((result: any) => {
      if (result.data) {
        this.images = [];
        this.images = result.data as unknown as Picture[];
      }
    });
  }
}
