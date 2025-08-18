import * as XLSX from 'xlsx';
import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Evenement } from '../formulaire/evenement-form';
import { SupabaseService } from '@core/services/supabase.service';
import { PopupService } from '@core/services/popup.service';
import { AlertService } from '@core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  imports: [NgIf, NgClass],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
})
export class ImportComponent {
  evenements: Evenement[] = [];

  private readonly supabaseService: SupabaseService = inject(SupabaseService);
  private readonly popupService: PopupService = inject(PopupService);
  private readonly alertService: AlertService = inject(AlertService);
  private readonly router: Router = inject(Router);

  public onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, {
        type: 'binary',
      });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.evenements = excelData.map((item: any) => {
        const evenement = {
          titre: item['Evénément'],
          date: item['Date'],
          annee: item['Année'],
          lieu: item['Lieu'],
          siteWeb: item['Site web'],
          stt: this.convertStringToBoolean(item['Obs. STT ?']),
          ad: this.convertStringToBoolean(item['Obs. Audio ?']),
          lsf: this.convertStringToBoolean(item['Obs. LSF ?']),
          transcription: this.convertStringToBoolean(item['Obs. STT DIRECT ?']),
          bim: this.convertStringToBoolean(item['Obs. BIM ?']),
          pmr: this.convertStringToBoolean(item['Obs. PMR ?']),
        } as Evenement;

        this.supabaseService
          .getEvenementExists(evenement.titre, evenement.date, evenement.annee)
          .then((value) => {
            if (value) {
              evenement.id = value;
            } else {
              evenement.id = undefined;
            }
          });

        return evenement;
      });

      console.log(this.evenements);
    };
    reader.readAsArrayBuffer(file);
  }

  convertStringToBoolean(value: string): boolean {
    // On gérera les pourcentages plus tard
    if (!isNaN(Number(value))) {
      return true;
    }

    if (value.toLowerCase() === 'non') {
      return false;
    }

    return true;
  }

  hasEvenementsDupliques() {
    return this.evenements.some((x) => x.id);
  }

  public onAddAll() {
    let titre = 'Confirmation';
    let message = "Confirmez-vous l'import de ces évènements ?";

    if (this.hasEvenementsDupliques()) {
      const nb = this.evenements.filter((x) => x.id).length;
      titre = 'Tous importer ?';
      message = `Êtes-vous sûr(e) d'écraser les ${nb} évènements existants ?`;
    }

    this.popupService.showPopup(titre, message, [
      {
        label: 'Oui',
        callback: () => {
          this.onImportEvenements(this.evenements.filter((x) => !x.id));
          this.onUpdateEvenements(this.evenements.filter((x) => x.id));
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
    ]);
  }

  public onAddSome() {
    const evenements = this.evenements.filter((x) => !x.id);

    this.popupService.showPopup(
      'Confirmation',
      `Confirmez-vous l'import de ${evenements.length} évènements ?`,
      [
        {
          label: 'Oui',
          callback: () => {
            this.onImportEvenements(evenements);
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

  private async onImportEvenements(items: Evenement[]) {
    this.popupService.closePopup();

    const { error } = await this.supabaseService.addEvenements(items);

    if (error) {
      this.alertService.showAlert(
        'error',
        "Une erreur s'est produite, veuillez réessayer : " + error.message
      );
      return;
    }

    this.alertService.showAlert(
      'success',
      'Les évènements ont correctement été importés dans la base de données'
    );

    this.router.navigate(['admin', 'liste']);
  }

  private async onUpdateEvenements(items: Evenement[]) {
    // const { data, error } = await this.supabaseService.updateEvenements(items);
  }
}
