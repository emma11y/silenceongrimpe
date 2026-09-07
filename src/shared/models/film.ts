export interface Film {
  id: number | undefined;
  titre: string;
  duree: number;
  anneeDiffusion: number;
  lienVisionnage?: string;
  qualiteSousTitres: 'professionnelle' | 'amateur';
  description: string;
  vignetteUrl: string;
  realisateurs: string;
  sousTitresIncrustes: boolean;
  sme: boolean;
  vost: boolean;
  lsf: boolean;
  ad: boolean;
}
