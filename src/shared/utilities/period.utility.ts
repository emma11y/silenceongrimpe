import { Evenement } from '@shared/models/evenement';
import { AgendaItem } from '@app/pages/home/agenda-carrousel/agenda-item';

const mapping: Record<string, number> = {
  janvier: 0,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11,
  // saisons
  printemps: 2, // mars
  été: 5, // juin
  automne: 8, // septembre
  hiver: 11, // décembre (on le place en fin d’année)
};

function parsePeriode(periode: string): Date[] {
  const parts = periode.toLowerCase().trim().split(' ');
  const year = parseInt(parts[parts.length - 1], 10);

  // On enlève l’année
  const motsPart = periode.toLowerCase().replace(year.toString(), '').trim();

  // Split sur &, -, /
  const mots = motsPart.split(/&|-|\//).map((m) => m.trim());

  const dates: Date[] = [];
  for (const mot of mots) {
    const month = mapping[mot];
    if (month !== undefined) {
      dates.push(new Date(year, month, 1));
    }
  }
  return dates;
}

export function filtrerPeriodes(
  liste: Evenement[] | AgendaItem[],
  hasFilter = true
): Evenement[] | AgendaItem[] {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);

  const parsed = liste.map((p) => {
    let dates = parsePeriode(`${p.date} ${p.annee}`);

    if (hasFilter) {
      dates = dates.filter((d) => d >= now);
    }

    const nextDate =
      dates.length > 0
        ? dates.sort((a, b) => a.getTime() - b.getTime())[0]
        : null;
    return { item: p, nextDate };
  });

  // On garde seulement celles qui ont une date future
  const filtered = parsed.filter((p) => p.nextDate !== null) as {
    item: AgendaItem | Evenement;
    nextDate: Date;
  }[];

  // Tri ascendant (du plus proche au plus lointain)
  filtered.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

  // On renvoie uniquement les labels
  return filtered.map((p) => p.item);
}
