import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RevalidateService {
  private revalidateUrl = `${environment.apiUrl}/api/revalidate`;
  private headers: HttpHeaders;

  private readonly http: HttpClient = inject(HttpClient);

  constructor() {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${environment.deploySecret}`);
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
