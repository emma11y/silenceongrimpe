import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router: Router = inject(Router);
  private supabase: SupabaseService = inject(SupabaseService);

  constructor() {}

  async canActivate(): Promise<boolean | UrlTree> {
    const session = await this.supabase.session;
    if (session) {
      return true;
    }
    // Redirection côté client (fonctionne aussi en SSR avec Angular 17+)
    return this.router.parseUrl('/admin/login');
  }
}
