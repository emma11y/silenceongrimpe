import { Component, inject } from '@angular/core';
import { EvenementForm } from './evenement-form';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ValidationSummaryComponent } from '@shared/components/validation-summary/validation-summary.component';
import { markControlAsTouchedOnForm } from '@shared/utilities/form.utility';
import { SupabaseService } from '@core/services/supabase.service';
import { AlertService } from '@core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulaire',
  imports: [ReactiveFormsModule, FormsModule, ValidationSummaryComponent],
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.scss',
})
export class FormulaireComponent {
  public isUpdate = false;

  public form: EvenementForm = new EvenementForm();

  private readonly supabase: SupabaseService = inject(SupabaseService);
  private readonly alertService: AlertService = inject(AlertService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  constructor() {
    this.route.params.subscribe(async (value) => {
      const id = value['id'];
      if (id) {
        const { data: evenements } = await this.supabase.getEvenementForm(id);
        if (evenements.length) {
          this.isUpdate = true;
          this.form = evenements[0] as unknown as EvenementForm;
        } else {
          this.router.navigate(['admin', 'formulaire']);
        }
      }
    });
  }

  public async onClick(ngForm: NgForm): Promise<void> {
    if (!ngForm.valid) {
      markControlAsTouchedOnForm(ngForm.form);
      return;
    }

    const { data, error } = await this.supabase.createOrUpdateEvenement(
      this.form
    );

    if (error) {
      this.alertService.showAlert(
        'error',
        "Une erreur s'est produite, veuillez réessayer : " + error.message
      );
      return;
    }

    if (!this.isUpdate) {
      this.isUpdate = true;
      this.alertService.showAlert('success', "L'évènement a bien été créé.");
      /*if (data) {
        this.router.navigate(['admin', 'formulaire', data[0].id]);
      }*/
    } else {
      this.alertService.showAlert('success', "L'événément a bien été modifié.");
      // this.router.navigate(['admin', 'liste']);
    }
    this.router.navigate(['admin', 'liste']);
  }
}
