import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { Actualite } from '@shared/models/actualite';
import { orderBy } from 'lodash-es';

@Component({
  selector: 'app-actualites',
  imports: [DisplayImageComponent, RouterLink, DatePipe],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.scss',
})
export class ActualitesComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);

  actualites: Actualite[] = [];

  constructor() {
    const actualites = this.route.snapshot.data['actualites'];

    this.actualites = orderBy(actualites, (x) => x.datePublication, 'desc');
  }
}
