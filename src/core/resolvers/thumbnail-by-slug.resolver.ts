import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class ThumbnailBySlugResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve(route: ActivatedRouteSnapshot) {
    return await this.supabase.getUrlBySlug(route.params['slug']);
  }
}
