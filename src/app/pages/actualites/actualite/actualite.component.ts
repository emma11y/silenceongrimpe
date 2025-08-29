import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MetadataService } from '@core/services/metadata.service';
import { Actualite } from '@shared/models/actualite';

@Component({
  selector: 'app-actualite',
  imports: [NgIf, RouterLink],
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.scss',
})
export class ActualiteComponent {
  actualite: Actualite | undefined;

  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);
  private metadataService: MetadataService = inject(MetadataService);

  constructor() {
    const actualite = this.route.snapshot.data['actualite'];

    const isApercu = this.route.snapshot.url.some((segment) =>
      segment.path.includes('apercu')
    );

    if (!actualite || (!isApercu && !actualite.publie)) {
      this.router.navigateByUrl('/erreur/404');
    }

    this.actualite = actualite as unknown as Actualite;

    this.metadataService.setMetadataForArticle(
      this.actualite.titre,
      this.actualite.description,
      this.actualite.datePublication,
      ''
    );
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
