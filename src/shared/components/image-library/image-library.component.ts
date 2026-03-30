import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  inject,
} from '@angular/core';
import { AlertService } from '@core/services/alert.service';
import { PopupService } from '@core/services/popup.service';
import { SupabaseService } from '@core/services/supabase.service';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-image-library',
  imports: [],
  templateUrl: './image-library.component.html',
  styleUrl: './image-library.component.scss',
})
export class ImageLibraryComponent {
  [x: string]: any;
  @Input() images: Picture[] = [];
  @Output() outputDisplayPicture: EventEmitter<Picture> =
    new EventEmitter<Picture>();
  @Output() outputRefresh: EventEmitter<boolean> = new EventEmitter<boolean>();

  private alertService: AlertService = inject(AlertService);
  private popupService: PopupService = inject(PopupService);
  private supabaseService: SupabaseService = inject(SupabaseService);

  public onDisplayImageClick(picture: Picture): void {
    this.outputDisplayPicture.emit(picture);
  }

  public onDeleteImageClick(picture: Picture): void {
    this.popupService.showPopup(
      "Supprimer l'image",
      `Voulez-vous supprimer cet image ${picture.name} ?`,
      [
        {
          label: 'Oui',
          callback: () => {
            this.supabaseService
              .deletePicture(picture.id)
              .then((result: any) => {
                this.popupService.closePopup();

                if (result.error) {
                  this.alertService.showAlert(
                    'error',
                    "La suppression de l'image a échouée.",
                  );
                  return;
                }

                this.outputRefresh.emit();

                this.alertService.showAlert(
                  'success',
                  "La suppression de l'image a réussie.",
                );
              });
          },
          class: 'button-primary',
        },
        {
          label: 'Non',
          callback: () => {
            this.popupService.closePopup();
          },
          class: 'button-secondary',
        },
      ],
    );
  }
}
