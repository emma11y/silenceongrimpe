import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ValidationSummaryComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form = new FormGroup({
    mail: new FormControl(''),
    password: new FormControl(''),
  });

  private alertService: AlertService = inject(AlertService);
  private supabase: SupabaseService = inject(SupabaseService);
  private readonly router: Router = inject(Router);

  constructor() {
    this.supabase.session.then((session) => {
      if (session) {
        this.router.navigate(['admin', 'tableau-de-bord']);
      }
    });
  }

  public async onClick(): Promise<void> {
    if (!this.form.valid) {
      markControlAsTouchedOnForm(this.form);
      return;
    }

    const { mail, password } = this.form.getRawValue();

    if (!mail || !password) {
      return;
    }

    try {
      const { data, error } = await this.supabase.signIn(mail, password);
      if (error) throw error;

      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        this.alertService.showAlert('error', error.message);
      }
    } finally {
      this.form.reset();
    }
  }
}
