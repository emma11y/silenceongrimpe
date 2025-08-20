import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AgendaItem } from '@app/pages/home/agenda-carrousel/agenda-item';
import { SupabaseService } from '@core/services/supabase.service';
import { filtrerPeriodes } from '@shared/utilities/period.utility';

@Injectable({ providedIn: 'root' })
export class AgendaResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve() {
    const result = await this.supabase.getEvenements();
    return filtrerPeriodes(result.data as AgendaItem[]) as AgendaItem[];
  }
}
