import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AlertService } from '@core/services/alert.service';
import { PopupService } from '@core/services/popup.service';
import { SupabaseService } from '@core/services/supabase.service';
import { Evenement } from '@shared/models/evenement';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { filtrerPeriodes } from '@shared/utilities/period.utility';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evenements',
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.scss',
})
export class EvenementsComponent implements OnInit {
  private supabaseService: SupabaseService = inject(SupabaseService);
  private alertService: AlertService = inject(AlertService);
  private popupService: PopupService = inject(PopupService);

  evenements: Evenement[] = [];
  evenementsFiltered: Evenement[] = [];

  hasDisplayPastEvents = signal(false);

  constructor() {
    effect(() => {
      this.evenementsFiltered = filtrerPeriodes(
        this.evenements,
        !this.hasDisplayPastEvents()
      ) as Evenement[];
    });
  }

  public ngOnInit(): void {
    this.getEvenements();
  }

  private getEvenements() {
    this.supabaseService.getEvenements().then((result: any) => {
      if (result.data) {
        this.evenements = result.data as unknown as Evenement[];

        this.evenementsFiltered = filtrerPeriodes(
          this.evenements,
          !this.hasDisplayPastEvents()
        ) as Evenement[];
      }
    });
  }

  onDelete(evenement: Evenement) {
    this.popupService.showPopup(
      'Supprimer la fiche',
      `Voulez-vous supprimer cet évènement ${evenement.titre} ?`,
      [
        {
          label: 'Oui',
          callback: () => {
            this.supabaseService
              .deleteEvenement(evenement.id)
              .then((result: any) => {
                this.popupService.closePopup();

                if (result.error) {
                  this.alertService.showAlert(
                    'error',
                    "La suppression de l'évènement a échouée."
                  );
                  return;
                }

                this.getEvenements();
                this.alertService.showAlert(
                  'success',
                  "La suppression de l'évènement a réussie."
                );
              });
          },
          class: 'button-primary',
        },
        {
          label: 'Non',
          callback: () => {
            this.popupService.closePopup();
          },
          class: 'button-secondary',
        },
      ]
    );
  }
}
