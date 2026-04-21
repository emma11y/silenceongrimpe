import { Position } from './position';
export interface Film {
  id: number | undefined;
  slug: string;
  titre: string;
  duree: number;
  description: string;
  realisateurs: string;
  sme: boolean;
  vost: boolean;
  vf: boolean;
  ad: boolean;
  publie: boolean;
  vignetteId: string | undefined;
  vignettePosition: Position;
}
