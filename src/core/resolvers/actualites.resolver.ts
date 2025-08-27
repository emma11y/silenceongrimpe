import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class ActualitesResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve() {
    const actualites = await this.supabase.getActualitesPublies();
    return actualites.data ?? [];
  }
}
