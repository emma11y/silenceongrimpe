import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-image',
  imports: [NgIf],
  template: `<img *ngIf="image" [src]="image.image" [alt]="image.alt" />`,
})
export class ImageComponent {
  private readonly supabase: SupabaseService = inject(SupabaseService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  image!: Picture;

  constructor() {
    const guid = this.route.snapshot.paramMap.get('guid');
    if (!guid) {
      this.router.navigate(['erreur', '404']);
      return;
    }

    this.supabase.getImage(guid).then((result) => {
      if (!result) {
        this.router.navigate(['erreur', '404']);
        return;
      }

      this.image = result;
    });
  }
}
