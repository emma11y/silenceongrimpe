import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ActualiteForm } from './actualite-form';
import { convertToSlug } from '@shared/utilities/string.utility';
import { FormsModule, NgForm } from '@angular/forms';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { PopupComponentComponent } from '@shared/components/popup-component/popup-component.component';
import { BibliothequeImagesComponent } from '../bibliotheque-images/bibliotheque-images.component';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-actualite-form',
  imports: [
    RouterLink,
    FormsModule,
    ValidationSummaryComponent,
    PopupComponentComponent,
    DisplayImageComponent,
  ],
  templateUrl: './actualite-form.component.html',
  styleUrl: './actualite-form.component.scss',
})
export class ActualiteFormComponent {
  private superbase: SupabaseService = inject(SupabaseService);
  private alertService: AlertService = inject(AlertService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  @ViewChild('popup', { static: true }) popup!: PopupComponentComponent;

  form: ActualiteForm = new ActualiteForm();
  picture!: Picture;

  isUpdate: boolean = false;

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        const { data: actualites } = await this.superbase.getActualite(slug);
        if (actualites) {
          this.isUpdate = true;

          const actualite = actualites[0];
          this.form = actualite as unknown as ActualiteForm;
        }
      }
    });
  }

  public onGenerateSlug() {
    if (!this.form.title) {
      return;
    }

    this.form.slug = convertToSlug(this.form.title);
  }

  public async onClick(form: NgForm): Promise<void> {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }

    const { data, error } = await this.superbase.createOrUpdateActualite(
      this.form
    );

    if (error) {
      throw error;
    }

    if (!this.isUpdate) {
      this.isUpdate = true;
      this.alertService.showAlert('success', "L'actualité a bien été créée.");
      this.router.navigate(['admin', 'actualite', this.form.slug]);
    } else {
      this.alertService.showAlert(
        'success',
        "L'actualité a bien été modifiée."
      );
    }
  }

  public async onChoosePicture(): Promise<void> {
    const promise = this.popup.open(BibliothequeImagesComponent, {
      pick: true,
    });

    this.popup['componentRef']?.instance.outputClose.subscribe(
      (picture: Picture) => {
        this.popup.onClose();

        if (picture && picture.id) {
          this.picture = picture;
          this.form.vignetteId = picture.id;
        }
      }
    );

    await promise;
  }
}
