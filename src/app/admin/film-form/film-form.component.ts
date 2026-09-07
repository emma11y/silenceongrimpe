import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
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

  form: Partial<Film> = {};

  isUpdate: boolean = false;

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        /* const { data: actualite } = await this.superbase.getActualite(slug);
        if (actualite) {
          this.isUpdate = true;
          this.form = actualite as unknown as Actualite;
          this.currentSlug = { ...actualite.slug };
        }*/
      }
    });
  }

  public onGenerateSlug() {
    if (!this.form.titre) {
      return;
    }

    this.form.slug = convertToSlug(this.form.titre);
  }

  public onClick(form: NgForm): void {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }
  }
}
