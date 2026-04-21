import { DatePipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FragmentService } from '@core/services/fragment.service';
import { MetadataService } from '@core/services/metadata.service';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { Actualite } from '@shared/models/actualite';
import { buildHtmlWithFootnotes } from '@utilities/footnote.utility';

@Component({
  selector: 'app-actualite',
  imports: [NgIf, RouterLink, DisplayImageComponent, DatePipe],
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.scss',
})
export class ActualiteComponent implements AfterViewInit {
  actualite: Actualite | undefined;
  contentHtml: SafeHtml | undefined;
  @ViewChild('content') private readonly content?: ElementRef<HTMLElement>;

  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);
  private metadataService: MetadataService = inject(MetadataService);
  private readonly fragmentService = inject(FragmentService);

  constructor() {
    const actualite = this.route.snapshot.data['actualite'];
    // const thumbnail = this.route.snapshot.data['thumbnail'] ?? '';

    const isApercu = this.route.snapshot.url.some((segment) =>
      segment.path.includes('apercu'),
    );

    if (!actualite || (!isApercu && !actualite.publie)) {
      this.router.navigateByUrl('/erreur/404');
    }

    this.actualite = actualite as unknown as Actualite;
    this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(
      buildHtmlWithFootnotes(this.actualite.html),
    );

    this.metadataService.setMetadataForArticle(
      this.actualite.titre,
      this.actualite.description,
      this.actualite.datePublication,
      '',
    );
  }

  ngAfterViewInit(): void {
    this.fragmentService.initFragments();
  }
}
