import { NgIf } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { Picture } from '@shared/models/picture';

@Component({
  selector: 'app-display-image',
  imports: [NgIf],
  templateUrl: './display-image.component.html',
  styleUrl: './display-image.component.scss',
})
export class DisplayImageComponent implements OnInit, OnChanges {
  @Input() id!: string;

  picture!: Picture;
  url!: string;

  private readonly supabase: SupabaseService = inject(SupabaseService);

  constructor() {}

  ngOnInit(): void {
    this.getImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange) {
      this.getImage();
    }
  }

  private getImage() {
    this.supabase.getImage(this.id).then((picture) => {
      if (picture) {
        this.picture = picture;
        this.url = this.supabase.getUrl(this.id);
      }
    });
  }
}
