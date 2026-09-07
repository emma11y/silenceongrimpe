import { Position } from './position';
export interface Film {
  id: number | undefined;
  slug: string;
  titre: string;
  duree: number;
  anneeDiffusion: number;
  qualiteSousTitres: 'professionnelle' | 'amateur';
  description: string;
  realisateurs: string;
  sousTitresIncrustes: boolean;
  sme: boolean;
  vost: boolean;
  vf: boolean;
  lsf: boolean;
  ad: boolean;
  publie: boolean;
  vignetteId: string | undefined;
  vignettePosition: Position;
}
