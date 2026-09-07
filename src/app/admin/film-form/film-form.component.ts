import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { Film } from '@shared/models/film';
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
      const id = value['id'];
      if (id) {
        const { data: film } = await this.supabase.getFilm(id);
        if (film) {
          this.isUpdate = true;
          this.form = film as Film;
        }
      }
    });
  }

  public async onClick(form: NgForm): Promise<void> {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }

    const { data, error } = await this.supabase.createOrUpdateFilm(this.form);

    if (error) {
      throw error;
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
