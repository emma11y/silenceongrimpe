export class Actualite {
  public id: number | undefined;
  public slug: string = '';
  public titre: string = '';
  public courtDescription: string = '';
  public description: string = '';
  public html: string = '';
  public datePublication: Date | undefined;
  public publie: boolean = false;
  public aLaUne: boolean = false;
  public vignetteId: string | undefined;
}
