import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { Film } from '@shared/models/film';

@Injectable({ providedIn: 'root' })
export class FilmsAccessiblesResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve() {
    const result = await this.supabase.getFilms();
    return result.data as Film[];
  }
}
