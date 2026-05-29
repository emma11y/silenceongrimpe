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
import { RevalidateService } from '@app/core/services/revalidate.service';
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

@Component({
  selector: 'app-actualite-form',
  standalone: true,
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
  private readonly revalidateService: RevalidateService =
    inject(RevalidateService);

  form: Actualite = new Actualite();
  picture!: Picture;
  footnotes: FootnoteItem[] = [];

  isUpdate: boolean = false;
  currentSlug: string = '';

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        const { data: actualite } = await this.superbase.getActualite(slug);
        if (actualite) {
          this.isUpdate = true;
          this.form = actualite as unknown as Actualite;
          this.currentSlug = { ...actualite.slug };
          this.syncContent(this.form.html ?? '');
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

      if (this.form.publie && this.form.slug !== this.currentSlug) {
        this.revalidateService.revalidateUpdate(
          this.currentSlug,
          this.form.slug,
        );
      }

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

  private syncContent(content: string): void {
    this.form.html = content ?? '';
    this.footnotes = extractFootnotes(this.form.html);
  }
}
