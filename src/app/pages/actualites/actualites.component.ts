import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actualite } from '@shared/models/actualite';

@Component({
  selector: 'app-actualites',
  imports: [],
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
