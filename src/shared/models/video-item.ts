export interface VideoItem {
  id: number;
  titre: string;
  src: string;
  thumbnail: string;
  transcription?: string; // URL vers le fichier .txt
}
