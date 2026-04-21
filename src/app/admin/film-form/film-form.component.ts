import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-film-form',
  imports: [],
  templateUrl: './film-form.component.html',
  styleUrl: './film-form.component.scss',
})
export class FilmFormComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

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
}
