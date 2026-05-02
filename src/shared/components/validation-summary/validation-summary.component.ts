import { Component, Input } from '@angular/core';

import { FormGroup, NgModel } from '@angular/forms';

@Component({
  selector: 'validation-summary',
  imports: [],
  templateUrl: './validation-summary.component.html',
  styleUrl: './validation-summary.component.scss',
})
export class ValidationSummaryComponent {
  @Input() id!: string;
  @Input()
  form!: FormGroup;
  @Input() controlName!: string;
  @Input() controlModel!: NgModel;
  @Input() fieldName!: string;

  get control() {
    if (this.form) {
      return this.form.get(this.controlName);
    }

    return this.controlModel;
  }
}
