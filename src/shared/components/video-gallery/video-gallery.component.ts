import { Component, Input, OnInit } from '@angular/core';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { NgFor } from '@angular/common';
import { VideoItem } from '@shared/models/video-item';

@Component({
  selector: 'app-video-gallery',
  imports: [VideoPlayerComponent, NgFor],
  standalone: true,
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss',
})
export class VideoGalleryComponent implements OnInit {
  @Input() nb: number | undefined;

  videos: VideoItem[] = [
    {
      id: 1,
      titre:
        'Pourquoi rendre les festivals de films d’aventure accessibles ? 1/2',
      src: '../../../assets/videos/REEL 1 ST.mp4',
      thumbnail: '../../../assets/videos/REEL 1.jpeg',
      transcription: '../../../assets/videos/REEL 1.txt',
    },
    {
      id: 2,
      titre:
        'Pourquoi rendre les festivals de films d’aventure accessibles ? 2/2',
      src: '../../../assets/videos/REEL 2 ST.mp4',
      thumbnail: '../../../assets/videos/REEL 2.jpeg',
      transcription: '../../../assets/videos/REEL 2.txt',
    },
    {
      id: 3,
      titre: `Le portrait d'Hélène, spécialiste data`,
      src: '../../../assets/videos/REEL HELENE ST.mp4',
      thumbnail: '../../../assets/videos/REEL HELENE.jpeg',
      transcription: '../../../assets/videos/REEL HELENE.txt',
    },
    {
      id: 4,
      titre: `Le portrait de Maude, spécialiste montage Ciné`,
      src: '../../../assets/videos/REEL MAUDE ST.mp4',
      thumbnail: '../../../assets/videos/REEL MAUDE.jpeg',
      transcription: '../../../assets/videos/REEL MAUDE.txt',
    },
  ];

  ngOnInit(): void {
    let videos = this.videos.reverse();

    if (this.nb) {
      videos = videos.slice(0, this.nb);
    }

    this.videos = videos;
  }

  selectedVideo: VideoItem | null = null;

  selectVideo(video: VideoItem) {
    this.selectedVideo = video;
  }

  closeModal() {
    this.selectedVideo = null;
  }
}
