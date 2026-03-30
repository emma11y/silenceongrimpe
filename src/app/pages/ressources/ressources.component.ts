import { Component } from '@angular/core';
import { PostCarrouselComponent } from '@shared/components/post-carrousel/post-carrousel.component';
import { PostGridComponent } from '@shared/components/post-grid/post-grid.component';

@Component({
  selector: 'app-ressources',
  imports: [PostGridComponent],
  templateUrl: './ressources.component.html',
  styleUrl: './ressources.component.scss',
})
export class RessourcesComponent {}
