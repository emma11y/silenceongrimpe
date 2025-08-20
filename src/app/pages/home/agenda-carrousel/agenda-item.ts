import { Evenement } from '@app/admin/evenement-form/evenement-form';

export interface AgendaItem extends Evenement {
  index: number;
  selected: boolean;
}
