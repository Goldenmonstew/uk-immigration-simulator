import {
  items,
  npcs,
  type GameState,
  type LogEntry,
  type Text,
} from '@uk-immigration/game';

// Presentation metadata only: the core log intentionally has no day field.
export type DayMemory = Pick<
  LogEntry,
  'year' | 'quarter' | 'text' | 'statDeltas'
> & {
  day: number;
  key: string;
  count: number;
};
export type ChangeSource = 'action' | 'observe' | 'fast';

export function recordMemories(
  diary: DayMemory[],
  before: GameState,
  after: GameState,
  source: ChangeSource,
): DayMemory[] {
  const added: DayMemory[] = [];
  let day = before.day.index;
  for (const entry of after.log.slice(before.log.length)) {
    if (entry.kind !== 'action' && entry.kind !== 'event') continue;
    // fastForward emits work/class, then weekend rest/relax, then festival.
    // Events stop it, so event choices are recorded by their own transition.
    if (source === 'fast') {
      if (entry.id === 'work' || entry.id === 'class') day = 0;
      if (entry.id === 'rest') day = 1;
      if (entry.id === 'festival') day = 2;
    }
    added.push({
      ...entry,
      day,
      key: `${entry.kind}:${entry.id}:${entry.choiceId ?? ''}`,
      count: 1,
    });
  }
  const out = after.outcome;
  if (
    source === 'action' &&
    out &&
    !added.length &&
    !['sleep', 'travel'].includes(out.kind)
  ) {
    const npc = npcs.find((n) => n.id === out.npc);
    const labels: Record<string, Text> = {
      talk: {
        zhCN: `和${npc?.name.zhCN ?? ''}聊天`,
        en: `Talked with ${npc?.name.en ?? ''}`,
      },
      gift: {
        zhCN: `送礼给${npc?.name.zhCN ?? ''}`,
        en: `A gift for ${npc?.name.en ?? ''}`,
      },
      harvest: { zhCN: '菜地收获', en: 'Allotment harvest' },
      catch: { zhCN: '池塘钓鱼', en: 'Fishing at the pond' },
    };
    const label = labels[out.kind] ?? out.text;
    if (label) {
      const goods = Object.entries(out.items ?? {}).map(([id, n]) => ({
        name: items.find((i) => i.id === id)?.name,
        n,
      }));
      const text = Object.fromEntries(
        (['zhCN', 'en'] as const).map((locale) => [
          locale,
          label[locale] +
            (goods.length
              ? ` · ${goods.map(({ name, n }) => `${name?.[locale] ?? (locale === 'en' ? 'Item' : '物品')} ${n > 0 ? '+' : ''}${n}`).join(', ')}`
              : ''),
        ]),
      ) as Text;
      added.push({
        year: before.year,
        quarter: before.quarter,
        day,
        key: `${out.kind}:${out.npc ?? ''}:${JSON.stringify(out.items ?? {})}`,
        text,
        statDeltas: out.statDeltas,
        count: 1,
      });
    }
  }
  return [...diary, ...added];
}

export function groupedMemories(
  diary: DayMemory[],
  year: number,
  quarter: number,
) {
  return [0, 1, 2].map((day) => {
    const grouped = new Map<string, DayMemory>();
    for (const entry of diary.filter(
      (m) => m.year === year && m.quarter === quarter && m.day === day,
    )) {
      const key = `${entry.key}:${entry.text.en}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.count += entry.count;
        for (const [stat, value] of Object.entries(entry.statDeltas ?? {})) {
          const k = stat as keyof NonNullable<DayMemory['statDeltas']>;
          existing.statDeltas![k] = (existing.statDeltas![k] ?? 0) + value;
        }
      } else
        grouped.set(key, { ...entry, statDeltas: { ...entry.statDeltas } });
    }
    return [...grouped.values()];
  });
}
