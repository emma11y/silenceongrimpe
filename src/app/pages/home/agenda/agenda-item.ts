import { Evenement } from '@app/admin/formulaire/evenement-form';

export interface AgendaItem extends Evenement {
  index: number;
  selected: boolean;
}
