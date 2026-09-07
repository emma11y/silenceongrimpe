export interface Film {
  id: number | undefined;
  slug: string;
  titre: string;
  duree: number;
  anneeDiffusion: number;
  qualiteSousTitres: 'professionnelle' | 'amateur';
  description: string;
  vignetteUrl: string;
  realisateurs: string;
  sousTitresIncrustes: boolean;
  sme: boolean;
  vost: boolean;
  vf: boolean;
  lsf: boolean;
  ad: boolean;
  publie: boolean;
}
