import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VideoGalleryComponent } from '@shared/components/video-gallery/video-gallery.component';

@Component({
  selector: 'app-liste-videos',
  imports: [RouterLink, VideoGalleryComponent],
  templateUrl: './liste-videos.component.html',
  styleUrl: './liste-videos.component.scss',
})
export class ListeVideosComponent {}
