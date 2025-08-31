import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevalidateService } from '@app/core/services/revalidate.service';
import { AlertService } from '@core/services/alert.service';
import { PopupService } from '@core/services/popup.service';
import { SupabaseService } from '@core/services/supabase.service';
import { Actualite } from '@shared/models/actualite';

@Component({
  selector: 'app-actualites',
  imports: [DatePipe, RouterLink],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.scss',
})
export class ActualitesComponent implements OnInit {
  private supabaseService: SupabaseService = inject(SupabaseService);
  private alertService: AlertService = inject(AlertService);
  private popupService: PopupService = inject(PopupService);
  private revalidateService: RevalidateService = inject(RevalidateService);

  actualites: Actualite[] = [];

  public ngOnInit(): void {
    this.getActualites();
  }

  private getActualites() {
    this.supabaseService.getActualites().then((result: any) => {
      if (result.data) {
        this.actualites = result.data as unknown as Actualite[];
      }
    });
  }

  public onPublie(actualite: Actualite) {
    actualite.publie = !actualite.publie;
    if (actualite.publie) {
      actualite.datePublication = new Date();
    }

    this.supabaseService.createOrUpdateActualite(actualite).then((result) => {
      const { error } = result;

      if (error) {
        this.alertService.showAlert(
          'error',
          "Une erreur s'est produite, veuillez réessayer : " + error.message
        );
        return;
      }

      if (actualite.publie) {
        this.revalidateService
          .revalidateInsert(actualite.slug)
          .subscribe((result) => {
            console.log(result);
          });
      } else {
        this.revalidateService
          .revalidateDelete(actualite.slug)
          .subscribe((result) => {
            console.log(result);
          });
      }

      this.alertService.showAlert(
        'success',
        `L'actualité a été correctement ${
          actualite.publie ? 'publié' : 'dépublié'
        }`
      );

      this.getActualites();
    });
  }

  public OnALaUne(actualite: Actualite) {
    actualite.aLaUne = !actualite.aLaUne;

    this.supabaseService.createOrUpdateActualite(actualite).then((result) => {
      const { error } = result;

      if (error) {
        this.alertService.showAlert(
          'error',
          "Une erreur s'est produite, veuillez réessayer : " + error.message
        );
        return;
      }

      this.alertService.showAlert(
        'success',
        `L'actualité a été correctement ${
          actualite.aLaUne ? 'mis en avant sur' : 'supprimé de'
        } la page d'accueil`
      );

      this.getActualites();
    });
  }

  onDelete(actualite: Actualite) {
    this.popupService.showPopup(
      "Supprimer l'actualité",
      `Voulez-vous supprimer cette actualité ${actualite.titre} ?`,
      [
        {
          label: 'Oui',
          callback: () => {
            this.supabaseService
              .deleteActualite(actualite.id)
              .then((result: any) => {
                this.popupService.closePopup();

                if (result.error) {
                  this.alertService.showAlert(
                    'error',
                    "La suppression de l'actualité a échouée."
                  );
                  return;
                }

                this.getActualites();
                this.alertService.showAlert(
                  'success',
                  "La suppression de l'actualité a réussie."
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
