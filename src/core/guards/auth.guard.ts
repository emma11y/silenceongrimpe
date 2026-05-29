import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router: Router = inject(Router);
  private supabase: SupabaseService = inject(SupabaseService);

  constructor() {}

  async canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const session = await this.supabase.session;
    if (session) {
      return true;
    }

    return this.router.createUrlTree(['/admin/login'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
  }
}
