import { Component } from '@angular/core';
import { VideoGalleryComponent } from '@shared/components/video-gallery/video-gallery.component';

@Component({
  selector: 'app-videos',
  imports: [VideoGalleryComponent],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {}
