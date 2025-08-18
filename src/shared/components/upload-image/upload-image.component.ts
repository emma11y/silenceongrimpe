import { NgIf } from '@angular/common';
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { Picture } from '@shared/models/picture';
import { ValidationSummaryComponent } from '../validation-summary/validation-summary.component';
import { SupabaseService } from '@core/services/supabase.service';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';

@Component({
  selector: 'app-upload-image',
  imports: [NgIf, ReactiveFormsModule, FormsModule, ValidationSummaryComponent],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss',
})
export class UploadImageComponent {
  public form: Picture = new Picture();
  @Output() outputClose = new EventEmitter();

  private readonly alertService: AlertService = inject(AlertService);
  private readonly supabaseService: SupabaseService = inject(SupabaseService);

  public onFileClick(): void {
    const inputFile: HTMLInputElement | null = document.querySelector('#image');
    if (inputFile) {
      inputFile.click();
    }
  }

  public onFileChange(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    const maxSize = 1 * 1024 * 1024; // 1Mo en octets

    if (file.size > maxSize) {
      this.alertService.showAlert(
        'error',
        "La taille de l'image ne doit pas dépasser 1 Mo."
      );

      const form = document.querySelector('form');
      form?.reset();

      return;
    }

    reader.onload = (e: any) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        // Convertir en tableau de bytes
        const bytes = new Uint8Array(result);

        // Nom du fichier
        const fileName = file.name;

        console.log('Nom du fichier:', fileName);
        console.log('Taille (octets):', bytes.length);
        console.log('Bytes:', bytes);

        this.form.name = fileName;
        const base64String = this.uint8ArrayToBase64(bytes);
        this.form.image = `data:${file.type};base64,${base64String}`;

        const imgElement = document.getElementById(
          'preview'
        ) as HTMLImageElement;
        imgElement.src = this.form.image;
      }
    };

    reader.readAsArrayBuffer(file);
  }

  uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.length;

    // Convertir chaque byte en caractère
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // Encoder en base64
    return btoa(binary);
  }

  public async onClick(ngForm: NgForm): Promise<void> {
    if (!ngForm.valid) {
      markControlAsTouchedOnForm(ngForm.form);
      return;
    }

    const { data, error } = await this.supabaseService.createImage(this.form);

    if (error) {
      this.alertService.showAlert(
        'error',
        "Une erreur s'est produite, veuillez réessayer : " + error.message
      );
      return;
    }

    this.alertService.showAlert(
      'success',
      "L'image a été correctement ajoutée dans la bibliothèque d'images."
    );

    this.outputClose.emit();
  }
}
