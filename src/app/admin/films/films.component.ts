import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AlertService } from '@core/services/alert.service';
import { PopupService } from '@core/services/popup.service';
import { SupabaseService } from '@core/services/supabase.service';
import { Film } from '@shared/models/film';

@Component({
  selector: 'app-films',
  imports: [RouterLink, NgClass],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss',
})
export class FilmsComponent implements OnInit {
  private supabaseService: SupabaseService = inject(SupabaseService);
  private alertService: AlertService = inject(AlertService);
  private popupService: PopupService = inject(PopupService);

  films: Film[] = [];

  public ngOnInit(): void {
    this.getFilms();
  }

  private getFilms() {
    this.supabaseService.getFilms().then((result: any) => {
      if (result.data) {
        this.films = result.data as unknown as Film[];
      }
    });
  }

  onDelete(film: Film) {
    this.popupService.showPopup(
      'Supprimer la fiche',
      `Voulez-vous supprimer ce film ${film.titre} ?`,
      [
        {
          label: 'Oui',
          callback: () => {
            this.supabaseService.deleteFilm(film.id).then((result: any) => {
              this.popupService.closePopup();

              if (result.error) {
                this.alertService.showAlert(
                  'error',
                  'La suppression du film a échouée.'
                );
                return;
              }

              this.getFilms();
              this.alertService.showAlert(
                'success',
                'La suppression du film a réussie.'
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
