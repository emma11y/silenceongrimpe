import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { NgIf } from '@angular/common';
import { ContactForm } from './contact-form';
import { AlertService } from '@core/services/alert.service';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import emailjs from 'emailjs-com';

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
  public regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  public contact: ContactForm = new ContactForm();

  ngOnInit(): void {}

  async onSubmit(form: NgForm): Promise<void> {
    if (
      !form.valid ||
      !this.isCaptchaValid() ||
      !this.isMailValid() ||
      !this.contact.mail ||
      !this.contact.message
    ) {
      markControlAsTouchedOnForm(form.form);

      if (this.contact.captcha) {
        this.contact.captcha = '';
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
        'template_tanj0kg',
        {
          name: this.contact.name,
          message: this.contact.message,
          reply_to: this.contact.mail,
        },
        'LVwSjhpUHzlOdDoLg'
      )
      .then(
        (response) => {
          form.resetForm();

          this.number1 = this.getRandomInt(1, 10);
          this.number2 = this.getRandomInt(1, 10);
          this.alertService.showAlert(
            'success',
            'Votre message a été envoyé, nous vous répondrons dans les brefs délais.'
          );
        },
        (error) => {
          this.alertService.showAlert(
            'error',
            `Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.`
          );
        }
      );
  }

  isCaptchaValid(): boolean {
    if (this.contact.captcha) {
      const expectedSum = this.number1 + this.number2;
      return Number.parseInt(this.contact.captcha) === expectedSum;
    }

    return false;
  }

  isMailValid(): boolean {
    if (this.contact.mail) {
      return this.regex.test(this.contact.mail);
    }

    return false;
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
