import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from 'emailjs-com';
import { AlertService } from '@core/services/alert.service';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { Film } from '@shared/models/film';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';

@Component({
  selector: 'app-ajout-film-accessible',
  imports: [RouterLink, FormsModule, ValidationSummaryComponent],
  templateUrl: './ajout-film-accessible.component.html',
  styleUrl: './ajout-film-accessible.component.scss',
})
export class AjoutFilmAccessibleComponent {
  private readonly alertService: AlertService = inject(AlertService);

  form: Partial<Film> = {};

  public number1: number = this.getRandomInt(1, 10);
  public number2: number = this.getRandomInt(1, 10);
  public captcha: string | undefined;
  public siteWeb: string | undefined;
  public vignetteUrlRegex: RegExp =
    /^https?:\/\/[^\s]+\.(jpe?g|png|webp|gif|svg)(\?[^\s#]*)?(#[^\s]*)?$/i;
  public lienVisionnageRegex: RegExp = /^https:\/\/[^\s]+$/;

  public async onSubmit(form: NgForm): Promise<void> {
    if (this.siteWeb) {
      return;
    }

    if (!form.valid || !this.isCaptchaValid()) {
      markControlAsTouchedOnForm(form.form);

      if (this.captcha) {
        this.captcha = '';
      }

      this.number1 = this.getRandomInt(1, 10);
      this.number2 = this.getRandomInt(1, 10);

      this.alertService.showAlert(
        'error',
        'Vous devez renseigner les champs obligatoires.'
      );

      return;
    }

    emailjs
      .send(
        'service_vjz4nem',
        'template_pvnlr4h',
        {
          titre: this.form.titre,
          description: this.form.description,
          vignetteUrl: this.form.vignetteUrl,
          realisateurs: this.form.realisateurs,
          duree: this.form.duree,
          anneeDiffusion: this.form.anneeDiffusion,
          lienVisionnage: this.form.lienVisionnage,
          qualiteSousTitres: this.form.qualiteSousTitres,
          sousTitresIncrustes: this.formatBoolean(
            this.form.sousTitresIncrustes
          ),
          sme: this.formatBoolean(this.form.sme),
          vost: this.formatBoolean(this.form.vost),
          lsf: this.formatBoolean(this.form.lsf),
          ad: this.formatBoolean(this.form.ad),
          adminLink: this.buildAdminLink(),
        },
        'LVwSjhpUHzlOdDoLg'
      )
      .then(
        () => {
          form.resetForm();
          this.form = {};
          this.number1 = this.getRandomInt(1, 10);
          this.number2 = this.getRandomInt(1, 10);
          this.alertService.showAlert(
            'success',
            'Votre proposition de film a bien été envoyée, merci !'
          );
        },
        () => {
          this.alertService.showAlert(
            'error',
            `Une erreur s'est produite lors de l'envoi de votre proposition. Veuillez réessayer.`
          );
        }
      );
  }

  public isCaptchaValid(): boolean {
    if (this.captcha) {
      const expectedSum = this.number1 + this.number2;
      return Number.parseInt(this.captcha) === expectedSum;
    }

    return false;
  }

  public getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private formatBoolean(value: boolean | undefined): string {
    return value ? 'Oui' : 'Non';
  }

  private buildAdminLink(): string {
    const params = new URLSearchParams();

    const setIfDefined = (key: string, value: unknown) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    };

    setIfDefined('titre', this.form.titre);
    setIfDefined('description', this.form.description);
    setIfDefined('vignetteUrl', this.form.vignetteUrl);
    setIfDefined('realisateurs', this.form.realisateurs);
    setIfDefined('duree', this.form.duree);
    setIfDefined('anneeDiffusion', this.form.anneeDiffusion);
    setIfDefined('lienVisionnage', this.form.lienVisionnage);
    setIfDefined('qualiteSousTitres', this.form.qualiteSousTitres);
    setIfDefined('sousTitresIncrustes', this.form.sousTitresIncrustes);
    setIfDefined('sme', this.form.sme);
    setIfDefined('vost', this.form.vost);
    setIfDefined('lsf', this.form.lsf);
    setIfDefined('ad', this.form.ad);

    return `${window.location.origin}/admin/film?${params.toString()}`;
  }
}
