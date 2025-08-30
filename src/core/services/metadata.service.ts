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
    const description =
      metadata.description ||
      "Silence, on grimpe ! est une association qui promeut l'escalade pour tous, en favorisant l'inclusion et l'accessibilité.";
    const currentUrl = `${HttpConfig.websiteUrl}${this.router.url}`;

    // Titre de la page
    this.title.setTitle(title);

    // Balises meta de base
    this.createOrUpdateTag('title', title);
    this.createOrUpdateTag('description', description);
    this.createOrUpdateTag('robots', metadata.robots || 'index,follow');

    // Balises Open Graph de base
    this.createOrUpdateTag('og:title', title);
    this.createOrUpdateTag('og:description', description);
    this.createOrUpdateTag('og:url', currentUrl);
    this.createOrUpdateTag('og:type', metadata.type || 'website');
    this.createOrUpdateTag('og:locale', 'fr_FR');
    this.createOrUpdateTag('og:site_name', 'Silence, on grimpe !');

    // Image par défaut si non spécifiée
    if (!metadata.image) {
      this.createOrUpdateTag(
        'og:image',
        `${HttpConfig.websiteUrl}/web-app-manifest-512x512.png`
      );
    } else {
      this.createOrUpdateTag('og:image', metadata.image);
    }

    // Twitter Card
    this.createOrUpdateTag('twitter:card', 'summary_large_image');
    this.createOrUpdateTag('twitter:title', title);
    this.createOrUpdateTag('twitter:description', description);

    // Autres métadonnées importantes
    this.createOrUpdateTag('viewport', 'width=device-width, initial-scale=1');
    this.createOrUpdateTag('theme-color', metadata.themeColor || '#ffffff');
    this.createOrUpdateTag('author', 'Silence, on grimpe !');

    // Canonique
    const linkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');
    linkElement.setAttribute('rel', 'canonical');
    linkElement.setAttribute('href', currentUrl);
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(linkElement);
    }
  }

  private createOrUpdateTag(property: string, content: string) {
    // Gérer à la fois les balises name et property
    const isOpenGraph = property.startsWith('og:');
    const attribute = isOpenGraph ? 'property' : 'name';

    // Rechercher la balise existante avec name ou property
    const existingTag = this.meta.getTag(`${attribute}='${property}'`);

    if (existingTag) {
      this.meta.updateTag({ [attribute]: property, content });
    } else {
      this.meta.addTag({ [attribute]: property, content });
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
