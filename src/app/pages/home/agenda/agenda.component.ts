import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Evenement } from '@app/admin/formulaire/evenement-form';
import { SupabaseService } from '@core/services/supabase.service';
import { AgendaItem } from './agenda-item';

@Component({
  selector: 'app-agenda',
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit {
  private readonly supabaseService: SupabaseService = inject(SupabaseService);

  public items: AgendaItem[] = [];

  ngOnInit(): void {
    this.getEvenements();
  }

  private getEvenements() {
    this.supabaseService.getEvenements().then((result: any) => {
      if (result.data) {
        this.items = result.data;

        this.items.forEach((item, index) => (item.index = index));
        this.items[0].selected = true;
        this.items[1].selected = true;
        this.items[2].selected = true;
      }
    });
  }

  onPreviousClick() {
    const itemsSelected = this.items.filter((x) => x.selected);
    if (itemsSelected[0].index === 0) {
      return;
    }

    if (itemsSelected.length === 3) {
      itemsSelected[2].selected = false;
    }
    const prevItem = this.items[itemsSelected[0].index - 1];
    if (prevItem) {
      prevItem.selected = true;
    }
  }

  onNextClick() {
    const itemsSelected = this.items.filter((x) => x.selected);

    if (itemsSelected.length === 1) {
      return;
    }

    itemsSelected[0].selected = false;
    const nextItem = this.items[itemsSelected[2].index + 1];
    if (nextItem) {
      nextItem.selected = true;
    }
  }
}
