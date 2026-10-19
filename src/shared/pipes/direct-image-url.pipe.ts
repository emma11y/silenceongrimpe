import { Pipe, PipeTransform } from '@angular/core';

const DROPBOX_HOSTS = ['www.dropbox.com', 'dropbox.com'];

@Pipe({ name: 'directImageUrl' })
export class DirectImageUrlPipe implements PipeTransform {
  transform(url: string | null | undefined): string {
    if (!url) {
      return '';
    }

    try {
      const parsed = new URL(url);

      if (!DROPBOX_HOSTS.includes(parsed.hostname)) {
        return url;
      }

      parsed.searchParams.delete('dl');
      parsed.searchParams.set('raw', '1');

      return parsed.toString();
    } catch {
      return url;
    }
  }
}
