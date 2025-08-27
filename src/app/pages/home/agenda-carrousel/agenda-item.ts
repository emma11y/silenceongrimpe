import { Evenement } from '@shared/models/evenement';

export interface AgendaItem extends Evenement {
  index: number;
  selected: boolean;
}
