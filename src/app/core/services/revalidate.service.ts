import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RevalidateService {
  private revalidateUrl = `${environment.apiUrl}/api/revalidate.js`;
  private headers!: HttpHeaders;

  private readonly http: HttpClient = inject(HttpClient);
  private readonly supabase: SupabaseService = inject(SupabaseService);

  constructor() {
    this.supabase.getVercelSecret().then((result) => {
      if (result.data) {
        this.headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${result.data.value}`);
      }
    });
  }

  revalidateInsert(slug: string) {
    return this.http.post(
      this.revalidateUrl,
      {
        operation: 'INSERT',
        slug,
      },
      { headers: this.headers }
    );
  }

  revalidateUpdate(oldSlug: string, newSlug: string) {
    return this.http.post(
      this.revalidateUrl,
      {
        operation: 'UPDATE',
        old_slug: oldSlug,
        new_slug: newSlug,
      },
      { headers: this.headers }
    );
  }

  revalidateDelete(slug: string) {
    return this.http.post(
      this.revalidateUrl,
      {
        operation: 'DELETE',
        slug,
      },
      { headers: this.headers }
    );
  }
}
