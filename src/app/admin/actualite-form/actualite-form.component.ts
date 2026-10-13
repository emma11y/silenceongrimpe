import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { SupabaseService } from '@core/services/supabase.service';
import { Actualite } from '@shared/models/actualite';
import { convertToSlug } from '@shared/utilities/string.utility';
import { FormsModule, NgForm } from '@angular/forms';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { BibliothequeImagesComponent } from '../bibliotheque-images/bibliotheque-images.component';
import { Picture } from '@shared/models/picture';
import { PopupComponentService } from '@core/services/popup-component.service';
import {
  extractFootnotes,
  FootnoteItem,
  removeFootnoteAt,
  replaceFootnoteAt,
} from '@shared/utilities/footnote.utility';
import {
  FootnoteDialogComponent,
  DialogResult,
} from './footnote-dialog/footnote-dialog.component';
import { ActualiteEditorComponent } from './actualite-editor/actualite-editor.component';
import {
  EmbeddedImage,
  extractEmbeddedImages,
  replaceEmbeddedImage,
} from '@shared/utilities/embedded-image.utility';
import {
  countInertSpans,
  removeInertSpans,
} from '@shared/utilities/html-cleanup.utility';

const SLOW_LOAD_DELAY_MS = 3000;

@Component({
  selector: 'app-actualite-form',
  imports: [
    RouterLink,
    FormsModule,
    ValidationSummaryComponent,
    DisplayImageComponent,
    ActualiteEditorComponent,
  ],
  templateUrl: './actualite-form.component.html',
  styleUrl: './actualite-form.component.scss',
})
export class ActualiteFormComponent {
  private superbase: SupabaseService = inject(SupabaseService);
  private alertService: AlertService = inject(AlertService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly popup: PopupComponentService = inject(PopupComponentService);

  form: Actualite = new Actualite();
  picture!: Picture;
  footnotes: FootnoteItem[] = [];

  isUpdate: boolean = false;
  currentSlug: string = '';
  // Tant que le html n'est pas chargé, l'éditeur n'est pas monté et l'envoi
  // est bloqué (sinon le html serait écrasé par une valeur vide).
  htmlLoading: boolean = false;
  // Images base64 dans le html : l'éditeur gèle la page avec des Mo de data-URI,
  // on ne le monte qu'après leur migration vers la table images.
  embeddedImages: EmbeddedImage[] = [];
  migrating: boolean = false;
  // Spans de style sans effet (copier-coller Google Docs) : en grand nombre,
  // ils font geler l'éditeur. Même principe : pas d'éditeur avant nettoyage.
  inertSpanCount: number = 0;
  cleaning: boolean = false;
  // Si le chargement traîne, on propose quand même le nettoyage sans attendre.
  slowLoad: boolean = false;
  private cleaned: boolean = false;

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        this.htmlLoading = true;
        this.slowLoad = false;
        setTimeout(() => {
          this.slowLoad = this.htmlLoading;
        }, SLOW_LOAD_DELAY_MS);
        const { data: actualite } =
          await this.superbase.getActualiteSansHtml(slug);
        if (actualite) {
          this.isUpdate = true;
          this.form = actualite as unknown as Actualite;
          this.currentSlug = { ...actualite.slug };
          await this.loadHtml(slug);
        } else {
          this.htmlLoading = false;
        }
      }
    });

    /* this.popup.onClose.pipe(first()).subscribe((result) => {
      console.log(result);

      const componentRef: ComponentRef<UploadImageComponent> =
        result.componentRef as ComponentRef<UploadImageComponent>;
      const componentName = componentRef?.instance?.constructor?.name;
      console.log('Component name:', componentName);
      if (componentName === 'UploadImageComponent') {
        setTimeout(() => this.onChoosePicture(), 100);
      }
    });*/
  }

  public onGenerateSlug() {
    if (!this.form.titre) {
      return;
    }

    this.form.slug = convertToSlug(this.form.titre);
  }

  public async onClick(form: NgForm): Promise<void> {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }

    /* if (this.form.publie && !this.form.datePublication) {
      this.form.datePublication = new Date();
    }*/

    const { data, error } = await this.superbase.createOrUpdateActualite(
      this.form,
    );

    if (error) {
      throw error;
    }

    if (!this.isUpdate) {
      this.isUpdate = true;

      this.alertService.showAlert('success', "L'actualité a bien été créée.");

      this.router.navigate(['admin', 'actualite', this.form.slug]);
    } else {
      this.alertService.showAlert(
        'success',
        "L'actualité a bien été modifiée.",
      );
    }
  }

  public async onChoosePicture(): Promise<void> {
    const promise = this.popup.open(BibliothequeImagesComponent, {
      pick: true,
    });

    this.popup.componentRef?.instance.outputClose.subscribe(
      (picture: Picture) => {
        this.popup.close();

        if (picture && picture.id) {
          //this.picture = picture;
          this.form.vignetteId = picture.id;
        }
      },
    );

    await promise;
  }

  public async onEditFootnote(footnoteIndex: number): Promise<void> {
    const footnote = this.footnotes[footnoteIndex];

    if (!footnote) {
      return;
    }

    const result = await this.openFootnoteDialog(
      footnote.content,
      'Modifier la note de bas de page',
    );

    if (!result?.content) {
      return;
    }

    this.syncContent(
      replaceFootnoteAt(this.form.html ?? '', footnoteIndex, result.content),
    );
  }

  public onRemoveFootnote(footnoteIndex: number): void {
    this.syncContent(removeFootnoteAt(this.form.html ?? '', footnoteIndex));
  }

  public onContentChange(content: string): void {
    this.syncContent(content);
  }

  private async openFootnoteDialog(
    initialValue: string = '',
    title: string = 'Ajouter une note de bas de page',
  ): Promise<DialogResult | undefined> {
    const promise = this.popup.open(FootnoteDialogComponent, {
      initialValue,
      title,
    });

    this.popup.componentRef?.instance.outputClose.subscribe(
      (result: DialogResult | undefined) => {
        this.popup.close(result);
      },
    );

    return promise;
  }

  private async loadHtml(slug: string): Promise<void> {
    const { data } = await this.superbase.getActualiteHtml(slug);

    // Nettoyage lancé pendant le chargement : ce html-ci est déjà périmé.
    if (!this.cleaned) {
      this.syncContent(data?.html ?? '');
      this.embeddedImages = extractEmbeddedImages(this.form.html);
      this.inertSpanCount = countInertSpans(this.form.html);
    }

    this.htmlLoading = false;
    this.slowLoad = false;
  }

  public async onCleanHtml(): Promise<void> {
    if (!this.form.id || this.cleaning) {
      return;
    }

    this.cleaning = true;

    try {
      // Pendant le chargement, form.html n'est pas encore là : on le relit.
      let source = this.form.html;

      if (this.htmlLoading) {
        const { data: current } = await this.superbase.getActualiteHtml(
          this.form.slug,
        );

        source = current?.html ?? '';
      }

      const html = removeInertSpans(source);

      this.downloadBackup(source);

      const { data, error } = await this.superbase.updateActualiteHtml(
        this.form.id,
        html,
      );

      if (error || !data?.length) {
        throw error ?? new Error("Mise à jour de l'actualité refusée.");
      }

      this.cleaned = true;
      this.syncContent(html);
      this.inertSpanCount = 0;
      this.slowLoad = false;
      this.alertService.showAlert('success', 'Le HTML a été nettoyé.');
    } catch (error) {
      this.alertService.showAlert(
        'error',
        `Nettoyage impossible : ${(error as Error).message}`,
      );
    } finally {
      this.cleaning = false;
    }
  }

  private downloadBackup(html: string): void {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const link = document.createElement('a');

    link.href = url;
    link.download = `${this.form.slug}.sauvegarde.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  public async onMigrateEmbeddedImages(): Promise<void> {
    if (!this.form.id || this.migrating) {
      return;
    }

    this.migrating = true;

    try {
      let html = this.form.html;

      // Toutes les images d'abord : si l'une échoue, le html reste inchangé.
      for (const [index, image] of this.embeddedImages.entries()) {
        const { data, error } = await this.superbase.createImage({
          image: image.dataUri,
          alt: image.alt,
          name: `${this.form.slug}-${index + 1}`,
          credit: '',
        } as Picture);

        if (error || !data?.[0]?.id) {
          throw error ?? new Error("Création de l'image refusée.");
        }

        html = replaceEmbeddedImage(
          html,
          image.dataUri,
          this.superbase.getUrl(data[0].id),
        );
      }

      const { data, error } = await this.superbase.updateActualiteHtml(
        this.form.id,
        html,
      );

      if (error || !data?.length) {
        throw error ?? new Error("Mise à jour de l'actualité refusée.");
      }

      this.syncContent(html);
      this.embeddedImages = [];
      this.alertService.showAlert('success', 'Les images ont été migrées.');
    } catch (error) {
      this.alertService.showAlert(
        'error',
        `Migration impossible : ${(error as Error).message}`,
      );
    } finally {
      this.migrating = false;
    }
  }

  private syncContent(content: string): void {
    this.form.html = content ?? '';
    this.footnotes = extractFootnotes(this.form.html);
  }
}
