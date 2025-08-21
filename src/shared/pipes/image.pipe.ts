import { inject, Pipe, PipeTransform } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { Picture } from '@shared/models/picture';
import { SupabaseClient } from '@supabase/supabase-js';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  private readonly supabase: SupabaseService = inject(SupabaseService);
  constructor() {}

  async transform(path: string): Promise<string | undefined> {
    /* const guid = path.split('/').pop()!;
    if (guid.includes(".")) return path;

    const { data, error } = await this.supabase.getImage(guid);

    if (error || !data) return path;

    const picture: Picture = data[0];

    return picture.image;*/

    return path;
  }
}
