import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoItem } from '@shared/models/video-item';

@Component({
  selector: 'app-video-player',
  imports: [NgIf, NgFor, NgClass],
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements OnInit {
  @Input() video: VideoItem | undefined;

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>;

  isPlaying = false;
  isMuted = false;
  progress = 0;
  duration = 0;
  currentTime = 0;
  volume = 1;
  showTranscription = false;
  playbackRates = [0.5, 1, 1.25, 1.5, 2];
  transcriptionContent = '';
  isLoadingTranscription = false;
  isFullscreen = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTranscription();

    // Écouter les changements d'état du plein écran
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  private loadTranscription() {
    if (this.video?.transcription) {
      this.isLoadingTranscription = true;
      this.http
        .get(this.video.transcription, { responseType: 'text' })
        .subscribe({
          next: (content) => {
            this.transcriptionContent = content;
            this.isLoadingTranscription = false;
          },
          error: (error) => {
            console.error(
              'Erreur lors du chargement de la transcription:',
              error
            );
            this.transcriptionContent =
              'Erreur lors du chargement de la transcription.';
            this.isLoadingTranscription = false;
          },
        });
    }
  }

  togglePlay() {
    const video = this.videoRef.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  toggleMute() {
    const video = this.videoRef.nativeElement;
    this.isMuted = !this.isMuted;
    video.muted = this.isMuted;
  }

  setVolume(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.volume = value;
    this.videoRef.nativeElement.volume = value;
  }

  onLoadedMetadata() {
    this.duration = this.videoRef.nativeElement.duration;
  }

  onTimeUpdate() {
    const video = this.videoRef.nativeElement;
    this.currentTime = video.currentTime;
    this.progress = (video.currentTime / video.duration) * 100;

    // Mettre à jour la propriété CSS pour la coloration de la barre de progression
    if (this.progressBarRef) {
      this.progressBarRef.nativeElement.style.setProperty(
        '--progress',
        `${this.progress}%`
      );
    }
  }

  seek(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    const video = this.videoRef.nativeElement;
    video.currentTime = (value / 100) * video.duration;
  }

  toggleFullscreen() {
    const container = this.containerRef.nativeElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  setPlaybackRate(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.videoRef.nativeElement.playbackRate = Number.parseInt(value);
  }

  toggleTranscription() {
    this.showTranscription = !this.showTranscription;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
