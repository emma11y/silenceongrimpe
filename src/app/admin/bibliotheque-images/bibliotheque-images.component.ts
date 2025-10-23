import {
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { PopupComponentService } from '@core/services/popup-component.service';
import { SupabaseService } from '@core/services/supabase.service';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { ImageLibraryComponent } from '@shared/components/image-library/image-library.component';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-bibliotheque-images',
  imports: [ImageLibraryComponent],
  templateUrl: './bibliotheque-images.component.html',
  styleUrl: './bibliotheque-images.component.scss',
})
export class BibliothequeImagesComponent implements OnInit {
  @Input() pick: boolean = false;
  @Output() outputClose: EventEmitter<Picture> = new EventEmitter<Picture>();

  public images: Picture[] = [];

  private readonly supabase: SupabaseService = inject(SupabaseService);

  private readonly popupComponentService: PopupComponentService = inject(
    PopupComponentService
  );

  public ngOnInit(): void {
    this.getImages();
  }

  public async addImageClick(): Promise<void> {
    // ouvre HelloComponent dans le popup, avec un input
    const promise = this.popupComponentService.open(UploadImageComponent);

    this.popupComponentService.componentRef?.instance.outputClose.subscribe(
      () => {
        this.popupComponentService.close();
        this.getImages();
      }
    );

    await promise;
  }

  public async onDisplayImageClick(picture: Picture) {
    if (this.pick) {
      this.outputClose.emit(picture);

      return;
    }

    const promise = this.popupComponentService.open(DisplayImageComponent, {
      id: picture.id,
    });

    this.popupComponentService.componentRef?.instance.outputClose.subscribe(
      () => {
        this.popupComponentService.close();
      }
    );

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
