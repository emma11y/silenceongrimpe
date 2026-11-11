import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { Film } from '@shared/models/film';
import { DirectImageUrlPipe } from '@shared/pipes/direct-image-url.pipe';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import {
  IMAGE_ACCEPT_ATTRIBUTE,
  readFileAsDataUrl,
  validateImageFile,
} from '@shared/utilities/image-file.utility';

@Component({
  selector: 'app-film-form',
  imports: [
    RouterLink,
    FormsModule,
    ValidationSummaryComponent,
    DirectImageUrlPipe,
  ],
  templateUrl: './film-form.component.html',
  styleUrl: './film-form.component.scss',
})
export class FilmFormComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly supabase: SupabaseService = inject(SupabaseService);
  private readonly alertService: AlertService = inject(AlertService);

  private readonly vignetteInput =
    viewChild<ElementRef<HTMLInputElement>>('vignetteInput');

  form: Partial<Film> = {};

  isUpdate: boolean = false;

  readonly imageAccept: string = IMAGE_ACCEPT_ATTRIBUTE;
  vignetteDataUrl: string | undefined;
  vignetteError: string | undefined;

  constructor() {
    this.route.params.subscribe(async (value) => {
      const id = value['id'];
      if (id) {
        const { data: film } = await this.supabase.getFilm(id);
        if (film) {
          this.isUpdate = true;
          this.form = film as Film;
        }
      } else {
        this.form = this.filmFromQueryParams(this.route.snapshot.queryParams);
      }
    });
  }

  vignetteSrc(id: string): string {
    return this.supabase.getVignetteUrl(id);
  }

  async onVignetteSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    this.vignetteDataUrl = undefined;
    this.vignetteError = undefined;

    if (!file) {
      return;
    }

    this.vignetteError = validateImageFile(file);

    if (this.vignetteError) {
      return;
    }

    this.vignetteDataUrl = await readFileAsDataUrl(file);
  }

  private filmFromQueryParams(
    queryParams: Record<string, string>,
  ): Partial<Film> {
    const toBoolean = (value: string | undefined) => value === 'true';
    const toNumber = (value: string | undefined) =>
      value ? Number(value) : undefined;

    return {
      titre: queryParams['titre'],
      description: queryParams['description'],
      vignetteId: queryParams['vignetteId'],
      realisateurs: queryParams['realisateurs'],
      duree: toNumber(queryParams['duree']) as number,
      anneeDiffusion: toNumber(queryParams['anneeDiffusion']) as number,
      lienVisionnage: queryParams['lienVisionnage'],
      qualiteSousTitres: queryParams['qualiteSousTitres'] as
        | 'professionnelle'
        | 'amateur',
      auteurSousTitres: queryParams['auteurSousTitres'],
      sousTitresIncrustes: toBoolean(queryParams['sousTitresIncrustes']),
      sme: toBoolean(queryParams['sme']),
      vfstfr: toBoolean(queryParams['vfstfr']),
      lsf: toBoolean(queryParams['lsf']),
      ad: toBoolean(queryParams['ad']),
      muet: toBoolean(queryParams['muet']),
    };
  }

  public async onClick(form: NgForm): Promise<void> {
    const hasVignette =
      this.vignetteDataUrl || this.form.vignetteId || this.form.vignetteUrl;

    if (!hasVignette && !this.vignetteError) {
      this.vignetteError = 'La vignette est obligatoire.';
    }

    if (!form.valid || this.vignetteError) {
      markControlAsTouchedOnForm(form.form);
      return;
    }

    const previousVignetteId = this.form.vignetteId;
    let newVignetteId: string | undefined;

    if (this.vignetteDataUrl) {
      newVignetteId = crypto.randomUUID();
      const { error: vignetteError } = await this.supabase.createVignette(
        newVignetteId,
        this.vignetteDataUrl,
      );

      if (vignetteError) {
        this.alertService.showAlert(
          'error',
          'L’envoi de la vignette a échoué. Veuillez réessayer.',
        );
        return;
      }

      this.form.vignetteId = newVignetteId;
    }

    const { data, error } = await this.supabase.createOrUpdateFilm(this.form);

    if (error) {
      if (newVignetteId) {
        this.form.vignetteId = previousVignetteId;
        await this.supabase.deleteVignette(newVignetteId);
      }

      throw error;
    }

    if (newVignetteId) {
      if (previousVignetteId) {
        await this.supabase.deleteVignette(previousVignetteId);
      }

      this.vignetteDataUrl = undefined;
      this.vignetteInput()!.nativeElement.value = '';
    }

    if (!this.isUpdate) {
      this.isUpdate = true;
      this.form.id = data?.[0]?.id;

      this.alertService.showAlert('success', 'Le film a bien été créé.');

      this.router.navigate(['admin', 'film', this.form.id]);
    } else {
      this.alertService.showAlert('success', 'Le film a bien été modifié.');
    }
  }
}
