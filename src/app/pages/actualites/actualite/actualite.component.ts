import { DatePipe } from '@angular/common';
import {
  ApplicationRef,
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  inject,
  OnDestroy,
  ViewChild,
  createComponent,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FragmentService } from '@core/services/fragment.service';
import { MetadataService } from '@core/services/metadata.service';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { VideoPlayerComponent } from '@shared/components/video-player/video-player.component';
import { Actualite } from '@shared/models/actualite';
import { buildHtmlWithFootnotes } from '@utilities/footnote.utility';
import { buildHtmlWithVideos } from '@utilities/video.utility';

@Component({
  selector: 'app-actualite',
  imports: [RouterLink, DisplayImageComponent, DatePipe],
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.scss',
})
export class ActualiteComponent implements AfterViewInit, OnDestroy {
  actualite: Actualite | undefined;
  contentHtml: SafeHtml | undefined;
  @ViewChild('content') private readonly content?: ElementRef<HTMLElement>;
  private readonly videoComponentRefs: ComponentRef<VideoPlayerComponent>[] =
    [];

  private applicationRef: ApplicationRef = inject(ApplicationRef);
  private environmentInjector: EnvironmentInjector =
    inject(EnvironmentInjector);
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
      buildHtmlWithVideos(buildHtmlWithFootnotes(this.actualite.html)),
    );

    this.metadataService.setMetadataForArticle(
      this.actualite.titre,
      this.actualite.description,
      this.actualite.datePublication,
      '',
    );
  }

  ngAfterViewInit(): void {
    this.renderVideoPlayers();
    this.fragmentService.initFragments();
  }

  ngOnDestroy(): void {
    for (const componentRef of this.videoComponentRefs) {
      this.applicationRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }

    this.videoComponentRefs.length = 0;
  }

  private renderVideoPlayers(): void {
    const host = this.content?.nativeElement;

    if (!host) {
      return;
    }

    const placeholders = host.querySelectorAll<HTMLElement>('app-video-player');

    for (const placeholder of placeholders) {
      const src = placeholder.dataset['videoSrc']?.trim();
      const thumbnail = placeholder.dataset['videoThumbnail']?.trim();
      const transcription = placeholder.dataset['videoTranscription']?.trim();
      const id = Number.parseInt(placeholder.dataset['videoId'] ?? '', 10);

      if (!src || !thumbnail) {
        placeholder.remove();
        continue;
      }

      const componentRef = createComponent(VideoPlayerComponent, {
        environmentInjector: this.environmentInjector,
        hostElement: placeholder,
      });

      componentRef.setInput('video', {
        id: Number.isNaN(id) ? undefined : id,
        src,
        thumbnail,
        transcription,
      });

      this.applicationRef.attachView(componentRef.hostView);
      componentRef.changeDetectorRef.detectChanges();
      this.videoComponentRefs.push(componentRef);
    }
  }
}
