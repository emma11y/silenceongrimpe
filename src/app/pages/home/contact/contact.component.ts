import { Component, inject } from '@angular/core';
import { ContactForm } from './contact-form';
import { FormsModule, NgForm } from '@node_modules/@angular/forms';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import { NgIf } from '@node_modules/@angular/common';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ValidationSummaryComponent, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly alertService: AlertService = inject(AlertService);

  public number1: number = this.getRandomInt(1, 10);
  public number2: number = this.getRandomInt(1, 10);

  public contact: ContactForm = new ContactForm();

  onSubmit(form: NgForm): void {
    if (!form.valid && !this.isCaptchaValid()) {
      markControlAsTouchedOnForm(form.form);

      this.alertService.showAlert(
        'error',
        'Vous devez renseigner les champs obligatoires.'
      );

      return;
    }

    form.resetForm();

    this.number1 = this.getRandomInt(1, 10);
    this.number2 = this.getRandomInt(1, 10);

    // TODO envoyer mail

    this.alertService.showAlert(
      'success',
      'Votre message a été envoyé, nous vous répondrons dans les brefs délais.'
    );
  }

  isCaptchaValid(): boolean {
    if (this.contact.captcha) {
      const expectedSum = this.number1 + this.number2;
      return Number.parseInt(this.contact.captcha) === expectedSum;
    }

    return false;
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
