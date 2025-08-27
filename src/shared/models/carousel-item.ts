export interface CarouselItem {
  id: number;
  slug: string;
  guid: string;
  //  picture: string;
  // altPicture: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  hidden?: boolean;
}
