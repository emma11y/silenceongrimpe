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
    {
      id: 5,
      titre: `Atelier sur le sous-titrage de films au festival Femmes en montagne`,
      src: '../../../assets/videos/REEL ARNAUD CELINE ST.mp4',
      thumbnail: '../../../assets/videos/REEL ARNAUD CELINE.jpg',
      transcription: '../../../assets/videos/REEL ARNAUD CELINE TEXTE.txt',
    },
    {
      id: 6,
      titre: `Portrait de Julie, spécialiste LSF`,
      src: '../../../assets/videos/REEL JULIE ST.mp4',
      thumbnail: '../../../assets/videos/REEL JULIE.jpg',
      transcription: '../../../assets/videos/REEL JULIE TEXTE.txt',
    },
    {
      id: 7,
      titre: `Portrait de Céline, spécialiste sous-titrage`,
      src: '../../../assets/videos/REEL CELINE V2 ST.mp4',
      thumbnail: '../../../assets/videos/REEL CELINE.jpeg',
      transcription: '../../../assets/videos/REEL CELINE.txt',
    },
    {
      id: 8,
      titre: `Portrait d'Emmanuelle, spécialiste Web et numérique`,
      src: '../../../assets/videos/REEL EMMANUELLE ST.mp4',
      thumbnail: '../../../assets/videos/REEL EMMANUELLE.jpeg',
      transcription: '../../../assets/videos/REEL EMMANUELLE.txt',
    },
    {
      id: 9,
      titre: `Portrait de Marion, spécialiste communication`,
      src: '../../../assets/videos/REEL MARION ST.mp4',
      thumbnail: '../../../assets/videos/REEL MARION.jpeg',
      transcription: '../../../assets/videos/REEL MARION.txt',
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
