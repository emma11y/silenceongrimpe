// image.interceptor.ts
import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { SupabaseService } from '@core/services/supabase.service';

@Injectable()
export class ImageInterceptor implements HttpInterceptor {
  private readonly supabaseService: SupabaseService = inject(SupabaseService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith('http://localhost:4200/image/')) {
      const guid = req.url.split('/').pop()!;

      return from(this.handleImageRequest(guid));
    }

    return next.handle(req);
  }

  private async handleImageRequest(guid: string): Promise<HttpEvent<any>> {
    const found = await this.supabaseService.getImage(guid);

    if (found && found.image) {
      const bytes = this.base64ToUint8Array(found.image);
      return new HttpResponse({
        status: 200,
        body: bytes.buffer,
      });
    }

    return new HttpResponse({ status: 404 });
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
