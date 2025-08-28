import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { Actualite } from '@shared/models/actualite';

@Component({
  selector: 'app-actualites',
  imports: [DisplayImageComponent, RouterLink],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.scss',
})
export class ActualitesComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);

  actualites: Actualite[] = [];

  constructor() {
    this.actualites = this.route.snapshot.data['actualites'];
  }
}
