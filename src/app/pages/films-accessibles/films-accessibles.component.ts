import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Film } from '@shared/models/film';

interface FilmsSearchFilters {
  titre: string;
  qualiteSousTitres?: 'professionnelle' | 'amateur';
  sousTitresIncrustes: boolean;
  lsf: boolean;
  ad: boolean;
  dureeMax?: number;
  anneeDiffusion?: number;
  realisateurs: string;
}

@Component({
  selector: 'app-films-accessibles',
  imports: [RouterLink, FormsModule],
  templateUrl: './films-accessibles.component.html',
  styleUrl: './films-accessibles.component.scss',
})
export class FilmsAccessiblesComponent {
  private static readonly DESCRIPTION_LIMIT = 200;
  private static readonly PAGE_SIZE = 10;
  private static readonly DEFAULT_FILTERS: FilmsSearchFilters = {
    titre: '',
    sousTitresIncrustes: false,
    lsf: false,
    ad: false,
    realisateurs: '',
  };

  private route: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('results', { static: true })
  private resultsSection!: ElementRef<HTMLElement>;

  films: Film[] = [];
  filteredFilms: Film[] = [];
  hasSearched = false;
  currentPage = 1;
  private expandedDescriptions = new Set<number>();

  filters: FilmsSearchFilters = {
    ...FilmsAccessiblesComponent.DEFAULT_FILTERS,
  };

  constructor() {
    this.films = this.route.snapshot.data['films'] as Film[];

    this.filteredFilms = this.films;
  }

  onSearch(): void {
    if (this.isFiltersEmpty()) {
      return;
    }

    const f = this.filters;
    this.filteredFilms = this.films.filter((film) => {
      if (
        f.titre &&
        !film.titre.toLowerCase().includes(f.titre.toLowerCase())
      ) {
        return false;
      }
      if (
        f.qualiteSousTitres &&
        film.qualiteSousTitres !== f.qualiteSousTitres
      ) {
        return false;
      }
      if (f.sousTitresIncrustes && !film.sousTitresIncrustes) {
        return false;
      }
      if (f.lsf && !film.lsf) {
        return false;
      }
      if (f.ad && !film.ad) {
        return false;
      }
      if (f.dureeMax != null && film.duree > f.dureeMax) {
        return false;
      }
      if (
        f.anneeDiffusion != null &&
        film.anneeDiffusion !== f.anneeDiffusion
      ) {
        return false;
      }
      if (
        f.realisateurs &&
        !film.realisateurs.toLowerCase().includes(f.realisateurs.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
    this.hasSearched = true;
    this.currentPage = 1;
    this.scrollToResults();
  }

  private isFiltersEmpty(): boolean {
    return (
      JSON.stringify(this.filters) ===
      JSON.stringify(FilmsAccessiblesComponent.DEFAULT_FILTERS)
    );
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(
        this.filteredFilms.length / FilmsAccessiblesComponent.PAGE_SIZE,
      ),
    );
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedFilms(): Film[] {
    const start = (this.currentPage - 1) * FilmsAccessiblesComponent.PAGE_SIZE;
    return this.filteredFilms.slice(
      start,
      start + FilmsAccessiblesComponent.PAGE_SIZE,
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.scrollToResults();
  }

  private scrollToResults(): void {
    const el = this.resultsSection.nativeElement;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.focus();
  }

  resetSearch(form: NgForm): void {
    form.resetForm({ ...FilmsAccessiblesComponent.DEFAULT_FILTERS });
    this.filteredFilms = this.films;
    this.hasSearched = false;
    this.currentPage = 1;
  }

  filmTags(film: Film): string[] {
    const tags: string[] = [];
    tags.push(film.vost ? 'VOSTFR' : film.sme ? 'VFST-SME' : 'VFST');
    tags.push(
      film.qualiteSousTitres === 'professionnelle' ? 'ST PRO' : 'ST AMATEUR',
    );
    if (film.sousTitresIncrustes) {
      tags.push('ST INCRUSTES');
    }
    if (film.lsf) {
      tags.push('LSF');
    }
    if (film.ad) {
      tags.push('AD');
    }
    return tags;
  }

  isDescriptionLong(film: Film): boolean {
    return (
      film.description.length > FilmsAccessiblesComponent.DESCRIPTION_LIMIT
    );
  }

  isExpanded(film: Film): boolean {
    return this.expandedDescriptions.has(film.id!);
  }

  toggleDescription(film: Film): void {
    if (this.expandedDescriptions.has(film.id!)) {
      this.expandedDescriptions.delete(film.id!);
    } else {
      this.expandedDescriptions.add(film.id!);
    }
  }

  formatRealisateurs(realisateurs: string): string {
    return realisateurs
      .split(';')
      .map((r) => r.trim())
      .join(' | ');
  }

  truncatedDescription(film: Film): string {
    if (!this.isDescriptionLong(film) || this.isExpanded(film)) {
      return film.description;
    }
    return (
      film.description
        .slice(0, FilmsAccessiblesComponent.DESCRIPTION_LIMIT)
        .trimEnd() + '…'
    );
  }
}
