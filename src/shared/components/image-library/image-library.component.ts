import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-image-library',
  imports: [],
  templateUrl: './image-library.component.html',
  styleUrl: './image-library.component.scss',
})
export class ImageLibraryComponent implements OnInit {
  private readonly supabase: SupabaseService = inject(SupabaseService);

  public images: Picture[] = [];

  public ngOnInit(): void {
    this.supabase.getImages().then((result: any) => {
      if (result.data) {
        this.images = result.data as unknown as Picture[];
        console.log(this.images);
      }
    });
  }
}
