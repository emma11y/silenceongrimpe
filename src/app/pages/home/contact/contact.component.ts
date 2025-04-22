import { Component } from '@angular/core';
import { ContactForm } from './contact-form';
import { FormsModule, NgForm } from '@node_modules/@angular/forms';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ValidationSummaryComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  public number1: number = this.getRandomInt(1, 10);
  public number2: number = this.getRandomInt(1, 10);

  public contact: ContactForm = new ContactForm();

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      markControlAsTouchedOnForm(form.form);
      return;
    }
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
