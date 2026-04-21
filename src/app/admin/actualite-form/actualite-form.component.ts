import { Component, inject, OnDestroy } from '@angular/core';
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
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import {
  createFootnoteToken,
  extractFootnotes,
  FootnoteItem,
  removeFootnoteAt,
  replaceFootnoteAt,
} from '@shared/utilities/footnote.utility';
import {
  FootnoteDialogComponent,
  FootnoteDialogResult,
} from './footnote-dialog/footnote-dialog.component';

@Component({
  selector: 'app-actualite-form',
  imports: [
    RouterLink,
    FormsModule,
    ValidationSummaryComponent,
    DisplayImageComponent,
    NgxEditorModule,
  ],
  templateUrl: './actualite-form.component.html',
  styleUrl: './actualite-form.component.scss',
})
export class ActualiteFormComponent implements OnDestroy {
  private superbase: SupabaseService = inject(SupabaseService);
  private alertService: AlertService = inject(AlertService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly popup: PopupComponentService = inject(PopupComponentService);
  private readonly revalidateService: RevalidateService =
    inject(RevalidateService);

  form: Actualite = new Actualite();
  picture!: Picture;

  isUpdate: boolean = false;
  currentSlug: string = '';

  editor: Editor = new Editor({
    history: true,
    keyboardShortcuts: true,
    plugins: [],
  });

  descriptionEditor: Editor = new Editor({
    history: true,
    keyboardShortcuts: true,
  });

  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],

    ['undo', 'redo'],
  ];

  get footnotes(): FootnoteItem[] {
    return extractFootnotes(this.form.html ?? '');
  }

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        const { data: actualite } = await this.superbase.getActualite(slug);
        if (actualite) {
          this.isUpdate = true;
          this.form = actualite as unknown as Actualite;
          this.currentSlug = { ...actualite.slug };
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

  ngOnDestroy(): void {
    this.editor.destroy();
    this.descriptionEditor.destroy();
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

  public async onAddFootnote(): Promise<void> {
    const result = await this.openFootnoteDialog();

    if (!result?.content || !this.editor.view) {
      return;
    }

    const token = createFootnoteToken(result.content);
    const { state, dispatch } = this.editor.view;
    const insertPosition = state.selection.to;
    const transaction = state.tr.insertText(
      token,
      insertPosition,
      insertPosition,
    );

    dispatch(transaction);
    this.editor.view.focus();
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

    this.form.html = replaceFootnoteAt(
      this.form.html ?? '',
      footnoteIndex,
      result.content,
    );
  }

  public onRemoveFootnote(footnoteIndex: number): void {
    this.form.html = removeFootnoteAt(this.form.html ?? '', footnoteIndex);
  }

  private async openFootnoteDialog(
    initialValue: string = '',
    title: string = 'Ajouter une note de bas de page',
  ): Promise<FootnoteDialogResult | undefined> {
    const promise = this.popup.open(FootnoteDialogComponent, {
      initialValue,
      title,
    });

    this.popup.componentRef?.instance.outputClose.subscribe(
      (result: FootnoteDialogResult | undefined) => {
        this.popup.close(result);
      },
    );

    return promise;
  }

  async onAddImage(executeCommandFn: (command: string, value: string) => void) {
    // Exemple : tu pourrais ouvrir un FilePicker ou un prompt
    /*const url = prompt('Entrez l’URL de l’image :');
    if (url) {
      executeCommandFn('insertImage', url);
    }*/

    const promise = this.popup.open(BibliothequeImagesComponent, {
      pick: true,
    });

    this.popup.componentRef?.instance.outputClose.subscribe(
      (picture: Picture) => {
        this.popup.close();

        if (picture && picture.id) {
          executeCommandFn('insertImage', this.superbase.getUrl(picture.id));
        }

        /*if (picture && picture.image) {
          //executeCommandFn('insertImage', picture.image);
        }*/

        // 2) Ajoute l’attribut ALT au dernier <img>
        setTimeout(() => {
          const editorElement = document.querySelector(
            '#editor .angular-editor-textarea',
          ) as HTMLElement;
          if (editorElement) {
            const imgs = editorElement.getElementsByTagName('img');
            const lastImg = imgs[imgs.length - 1];
            if (lastImg) {
              lastImg.setAttribute('alt', picture.alt);
              lastImg.style.width = '15em';
            }
          }
        });
      },
    );

    await promise;
  }
}
