import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class ActualiteBySlugResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve(route: ActivatedRouteSnapshot) {
    const actualite = await this.supabase.getActualite(route.params['slug']);
    return actualite?.data;
  }
}
