import { Component, ComponentRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ActualiteForm } from './actualite-form';
import { convertToSlug } from '@shared/utilities/string.utility';
import { FormsModule, NgForm } from '@angular/forms';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { DisplayImageComponent } from '@shared/components/display-image/display-image.component';
import { PopupComponentComponent } from '@shared/components/popup-component/popup-component.component';
import { BibliothequeImagesComponent } from '../bibliotheque-images/bibliotheque-images.component';
import { Picture } from '@shared/models/picture';
import { PopupComponentService } from '@core/services/popup-component.service';
import { UploadImageComponent } from '@shared/components/upload-image/upload-image.component';
import { first } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';

@Component({
  selector: 'app-actualite-form',
  imports: [
    RouterLink,
    FormsModule,
    ValidationSummaryComponent,
    DisplayImageComponent,
    HttpClientModule,
    AngularEditorModule,
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

  form: ActualiteForm = new ActualiteForm();
  picture!: Picture;

  isUpdate: boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    //  minHeight: '5rem',
    // maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',

    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    //defaultFontName: 'Luciole',
    /* defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],*/
    /*customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],*/
    //uploadUrl: 'v1/image',
    //upload: (file: File) => {  },
    //uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['fontSize'],
      ['fontName'],
      ['insertImage', 'insertVideo'],
      ['subscript', 'strikeThrough', 'superscript'],
      ['justifyFull'],
    ],
  };

  constructor() {
    this.route.params.subscribe(async (value) => {
      const slug = value['slug'];
      if (slug) {
        const { data: actualite } = await this.superbase.getActualite(slug);
        if (actualite) {
          this.isUpdate = true;
          this.form = actualite as unknown as ActualiteForm;
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
      this.form
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
        "L'actualité a bien été modifiée."
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
      }
    );

    await promise;
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
            '#editor .angular-editor-textarea'
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
      }
    );

    await promise;
  }
}
