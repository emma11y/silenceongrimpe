import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { Film } from '@shared/models/film';
import { convertToSlug } from '@shared/utilities/string.utility';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';

@Component({
  selector: 'app-film-form',
  imports: [RouterLink, FormsModule, ValidationSummaryComponent],
  templateUrl: './film-form.component.html',
  styleUrl: './film-form.component.scss',
})
export class FilmFormComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly supabase: SupabaseService = inject(SupabaseService);
  private readonly alertService: AlertService = inject(AlertService);

  form: Partial<Film> = {};

  isUpdate: boolean = false;

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        const { data: film } = await this.supabase.getFilm(slug);
        if (film) {
          this.isUpdate = true;
          this.form = film as Film;
        }
      }
    });
  }

  public onGenerateSlug() {
    if (!this.form.titre) {
      return;
    }

    this.form.slug = convertToSlug(this.form.titre);
  }

  public async onClick(form: NgForm): Promise<void> {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }

    const { error } = await this.supabase.createOrUpdateFilm(this.form);

    if (error) {
      throw error;
    }

    if (!this.isUpdate) {
      this.isUpdate = true;

      this.alertService.showAlert('success', 'Le film a bien été créé.');

      this.router.navigate(['admin', 'film', this.form.slug]);
    } else {
      this.alertService.showAlert('success', 'Le film a bien été modifié.');
    }
  }
}
