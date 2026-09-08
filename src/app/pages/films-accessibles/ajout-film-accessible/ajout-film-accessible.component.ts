import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from 'emailjs-com';
import { AlertService } from '@core/services/alert.service';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { Film } from '@shared/models/film';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';

@Component({
  selector: 'app-ajout-film-accessible',
  imports: [FormsModule, ValidationSummaryComponent],
  templateUrl: './ajout-film-accessible.component.html',
  styleUrl: './ajout-film-accessible.component.scss',
})
export class AjoutFilmAccessibleComponent {
  private readonly alertService: AlertService = inject(AlertService);

  form: Partial<Film> = {};

  public async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
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
        },
        'LVwSjhpUHzlOdDoLg'
      )
      .then(
        () => {
          form.resetForm();
          this.form = {};
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

  private formatBoolean(value: boolean | undefined): string {
    return value ? 'Oui' : 'Non';
  }
}
