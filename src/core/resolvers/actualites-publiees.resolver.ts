import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class ActualitesPublieesResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve() {
    const actualites = await this.supabase.getActualitesPubliees();
    return actualites.data ?? [];
  }
}
