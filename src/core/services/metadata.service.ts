import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpConfig } from '@core/configs/http.config';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private readonly meta: Meta = inject(Meta);
  private title: Title = inject(Title);
  private readonly router: Router = inject(Router);

  public setMetadata(metadata: any): void {
    const title = `${metadata.title} | Silence, on grimpe !`;

    this.title.setTitle(title);

    this.createOrUpdateTag('title', title);

    this.createOrUpdateTag('og:title', title);

    this.createOrUpdateTag('description', metadata.description);

    this.createOrUpdateTag('og:description', metadata.description);

    if (metadata.robots) {
      this.meta.updateTag({ name: 'robots', content: metadata.robots });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'follow,index' });
    }

    this.createOrUpdateTag(
      'og:url',
      `${HttpConfig.websiteUrl}${this.router.url}`
    );

    this.createOrUpdateTag('og:locale', 'fr_FR');
  }

  private createOrUpdateTag(property: string, content: string) {
    if (this.meta.getTag(`property='${property}'`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  public setMetadataForArticle(
    title: string,
    description: string,
    date: Date | undefined,
    thumbnail: string
  ): void {
    const metadata = {
      title,
      description,
    };

    this.setMetadata(metadata);

    this.createOrUpdateTag('og:type', 'article');

    if (date) {
      this.createOrUpdateTag(
        'article:published_time',
        new Date(date).toISOString()
      );
    }

    if (thumbnail) {
      this.createOrUpdateTag('og:image', thumbnail);
    } else {
      this.createOrUpdateTag(
        'og:image',
        `${HttpConfig.websiteUrl}/web-app-manifest-512x512.png`
      );
    }
  }
}
