import { Component, inject, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

interface Error {
  code?: number;
  description: string;
  // image: string;
  title: string;
}

const errors: Error[] = [
  {
    // Other
    description: `Une erreur est survenue`,
    // image: 'grenouille.png',
    title: 'Erreur',
  },
  {
    code: 401, // Unauthorized
    description: `Accès non autorisé`,
    // image: 'cosmonaute.png',
    title: 'Erreur 401',
  },
  {
    code: 403, // Forbidden
    description: `Accès refusé`,
    // image: 'cosmonaute.png',
    title: 'Erreur 403',
  },
  {
    code: 404, // NotFound
    description: `Cette page est introuvable`,
    // image: 'telescope.png',
    title: 'Erreur 404',
  },
];

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [NgIf, RouterLink, RouterModule],
})
export class ErrorComponent {
  @Input() public code!: number;
  public error: Error | undefined;

  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.error = errors.find(
      (e) => e.code + '' === this.route.snapshot.url[0]?.path
    );

    if (!this.error) this.error = errors[0];
  }

  //#region LIFE CYCLES
  public ngOnInit(): void {
    if (!this.error) {
      return;
    }

    const metadata = {
      title: this.error.title,
      robots: 'noindex, nofollow',
    };

    // this.setMetadata(metadata);
  }
  //#endregion

  //#region EVENTS

  //#endregion

  //#region FUNCTIONS

  //#endregion
}
