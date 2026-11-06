import * as React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { evaluate, type Locale } from '@uk-immigration/engine';
import * as core from '@uk-immigration/game';
import type { GameState } from '@uk-immigration/game';
import GameClient from '../app/game/game-client';
import TownCanvas from '../app/game/town-canvas';
import {
  CharacterSelect,
  Ending,
  EventCard,
  LocationMenu,
  Modal,
  ProgressBars,
  QuarterSummary,
  StatusBar,
} from '../app/game/game-view';
import {
  Dialogue,
  Fishing,
  Inventory,
  ItemIcon,
  Kitchen,
  Mailbox,
  MorningCard,
  PlotMenu,
  Shop,
  TravelCard,
  OutcomeText,
} from '../app/game/life-overlays';
import {
  gameStorage,
  gameDraft,
  itemIcon,
  spritePath,
  withGameLocale,
  visibleResidents,
  homeSpot,
} from '../app/game/session';
import {
  recordMemories,
  groupedMemories,
  type DayMemory,
} from '../app/game/diary';
import { t } from '../i18n';
import townMap from '../public/game/town.json';
import homeMap from '../public/game/home.json';
import { LocaleContext } from '../i18n/locale';
import { decodeDraft, encodeDraft } from '../lib/share';
vi.mock('react', { spy: true });
vi.mock('../app/game/town-canvas', () => ({ default: () => null }));
vi.mock('../app/game/sound', () => ({
  playSound: vi.fn(),
  hideSound: vi.fn(),
  readMuted: () => true,
  setMuted: vi.fn(),
  setSoundSeason: vi.fn(),
  stopSound: vi.fn(),
  unlockSound: vi.fn(),
}));
const actualReact = await vi.importActual<typeof React>('react');
const storage = new Map<string, string>();
const cjk = /[\u3400-\u9fff]/;
const fixtures: core.GameEvent[] = ['morning', 'letter', 'phone'].map((id) => ({
  id,
  title: { zhCN: '测试消息', en: 'Test message' },
  text: { zhCN: '今天的小事。', en: 'A moment today.' },
  weight: 0,
  once: true,
  channel: id as core.Channel,
  choices: [
    {
      id: 'yes',
      label: { zhCN: '好，记下了', en: 'All right' },
      effects:
        id === 'letter'
          ? [{ type: 'item', item: 'seed-potato', delta: 1 }]
          : [{ type: 'none' }],
    },
  ],
}));
// Test-only deliveries; all transitions still run through the real core.
const initial = (locale: Locale = 'zh-CN', id = core.characters[0].id) => {
  const state = core.newGame(id, 42, locale);
  state.eventQueue = [];
  state.pendingEvent = 'morning';
  state.day.deliveries = [
    { eventId: 'letter', channel: 'letter' },
    { eventId: 'phone', channel: 'phone', minute: 1080 },
  ];
  state.inventory = { tea: 2, biscuits: 1, 'seed-potato': 2, flowers: 1 };
  state.friendship.margaret = 86;
  return state;
};
const active = (locale: Locale = 'zh-CN') =>
  core.resolve(initial(locale), 'yes');
const at = (
  minute: number,
  place: core.PlaceId = 'home',
  locale: Locale = 'zh-CN',
) => {
  const s = active(locale);
  s.day.minute = minute;
  s.day.place = place;
  return s;
};
beforeEach(() => {
  storage.clear();
  for (const character of core.characters) character.events.push(...fixtures);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, v: string) => storage.set(key, v),
  });
});
afterEach(() => {
  for (const character of core.characters)
    character.events = character.events.filter(
      (event) => !fixtures.includes(event),
    );
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
type Props = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  onChange?: (event: { target: { value: string } }) => void;
};
function walk(
  node: React.ReactNode,
  visit: (e: React.ReactElement<Props>) => void,
) {
  React.Children.forEach(node, (c) => {
    if (React.isValidElement<Props>(c)) {
      visit(c);
      walk(c.props.children, visit);
    }
  });
}
function content(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((c) =>
      React.isValidElement<Props>(c) ? content(c.props.children) : String(c),
    )
    .join('');
}
function renderView(make: () => React.ReactNode, locale: Locale = 'zh-CN') {
  const buttons: { label: string; click: () => void; disabled?: boolean }[] =
    [];
  let tree: React.ReactNode;
  function Probe() {
    tree = make();
    walk(tree, (e) => {
      if (e.type === 'button' && e.props.onClick)
        buttons.push({
          label: content(e.props.children),
          click: e.props.onClick,
          disabled: e.props.disabled,
        });
    });
    return tree;
  }
  const html = renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      <Probe />
    </LocaleContext>,
  );
  return {
    html,
    buttons,
    click(prefix: string) {
      const b = buttons.find((b) => b.label.startsWith(prefix));
      expect(b, `Button: ${prefix}`).toBeDefined();
      expect(b!.disabled).not.toBe(true);
      b!.click();
    },
    props<P extends object>(component: React.JSXElementConstructor<P>): P {
      let result: P | undefined;
      walk(tree, (e) => {
        if (e.type === component) result = e.props as P;
      });
      expect(result).toBeDefined();
      return result!;
    },
    input(value: string) {
      walk(tree, (e) => {
        if (e.type === 'input') e.props.onChange?.({ target: { value } });
      });
    },
  };
}
// Minimal hook runner for controller transitions and timed overlays, without a DOM or Phaser.
function harness(make: () => React.ReactNode, locale: Locale = 'zh-CN') {
  const stateHook = actualReact.useState,
    refHook = actualReact.useRef,
    effectHook = actualReact.useEffect;
  const values: unknown[] = [],
    refs: { current: unknown }[] = [],
    effects: { deps?: React.DependencyList; cleanup?: () => void }[] = [];
  let running = false,
    si = 0,
    ri = 0,
    ei = 0;
  let pending: {
    i: number;
    fn: React.EffectCallback;
    deps?: React.DependencyList;
  }[] = [];
  vi.spyOn(React, 'useState').mockImplementation(((initial: unknown) => {
    if (!running) return stateHook(initial);
    const i = si++;
    if (!(i in values))
      values[i] = typeof initial === 'function' ? initial() : initial;
    return [
      values[i],
      (next: unknown) => {
        values[i] = typeof next === 'function' ? next(values[i]) : next;
      },
    ];
  }) as typeof React.useState);
  vi.spyOn(React, 'useRef').mockImplementation(((initial: unknown) => {
    if (!running) return refHook(initial);
    const i = ri++;
    return refs[i] ?? (refs[i] = { current: initial });
  }) as typeof React.useRef);
  vi.spyOn(React, 'useEffect').mockImplementation((fn, deps) => {
    if (!running) return effectHook(fn, deps);
    const i = ei++,
      old = effects[i];
    if (!old || !deps || deps.some((d, j) => !Object.is(d, old.deps?.[j])))
      pending.push({ i, fn, deps });
  });
  return {
    render() {
      si = ri = ei = 0;
      pending = [];
      return renderView(() => {
        running = true;
        const tree = make();
        running = false;
        return tree;
      }, locale);
    },
    flush() {
      const work = pending;
      pending = [];
      for (const { i, fn, deps } of work) {
        effects[i]?.cleanup?.();
        effects[i] = { deps, cleanup: fn() || undefined };
      }
    },
    dispose() {
      effects.forEach((e) => e.cleanup?.());
    },
    values,
  };
}

test.each(['zh-CN', 'en'] as const)(
  'clock, weather, morning and all character choices in %s',
  (locale) => {
    const state = initial(locale),
      onContinue = vi.fn(),
      onChange = vi.fn();
    const hud = renderView(() => StatusBar({ state }), locale);
    expect(hud.html).toContain('07:00');
    expect(hud.html).toContain(state.day.date);
    expect(hud.html).toContain(t(`game.${state.day.weather}`, locale));
    expect(hud.html).not.toContain('action points');
    const morning = renderView(
      () => MorningCard({ state, onContinue }),
      locale,
    );
    expect(morning.html).toContain(
      t('game.mailCount', locale).replace('{count}', '1'),
    );
    morning.click(t('game.beginDay', locale));
    expect(onContinue).toHaveBeenCalledOnce();
    const select = renderView(
      () =>
        CharacterSelect({ saves: { [state.characterId]: state }, onChange }),
      locale,
    );
    for (const c of core.characters)
      expect(select.html).toContain(spritePath(c.id));
    select.click(t('game.continue', locale));
    expect(onChange).toHaveBeenCalledWith(state);
    if (locale === 'en')
      for (const v of [hud, morning, select]) expect(v.html).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'hours, workday restrictions, office shift and indoor people in %s',
  (locale) => {
    let state = at(420, 'work', locale);
    const onChange = vi.fn();
    const closed = renderView(
      () => LocationMenu({ state, location: 'work', onChange }),
      locale,
    );
    expect(closed.html).toContain('09:00–20:00');
    expect(core.places.find((p) => p.id === 'work')!.hours!.opens).toBe(540);
    expect(closed.html).toContain(t('game.closed', locale));
    expect(closed.buttons).toHaveLength(0);
    state = at(540, 'work', locale);
    const onTalk = vi.fn();
    const menu = renderView(
      () => LocationMenu({ state, location: 'work', onChange, onTalk }),
      locale,
    );
    menu.click(locale === 'en' ? 'Work a shift' : '上班');
    const next = onChange.mock.lastCall![0];
    expect(next.day.minute).toBe(1020);
    expect(next.stats.money).toBeGreaterThan(state.stats.money);
    expect(next.stats.career).toBeGreaterThan(state.stats.career);
    menu.click(locale === 'en' ? 'Ade' : '阿德');
    expect(onTalk).toHaveBeenCalledWith('ade');
    state.day.kind = 'weekend';
    expect(core.activities(state, 'work')).toEqual([]);
    expect(core.activities(state, 'gp')).toEqual([]);
    state.day.minute = 480;
    expect(core.activities(state, 'council').length).toBeGreaterThan(0);
    const visa = renderView(
      () => LocationMenu({ state, location: 'visa', onChange }),
      locale,
    );
    expect(visa.html).not.toContain(t('game.closed', locale));
    if (locale === 'en') expect(menu.html).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'dialogue, gift inventory and a speaker heart event in %s',
  (locale) => {
    let state = core.talk(active(locale), 'margaret');
    const onChange = (next: GameState) => {
      state = next;
    };
    const h = harness(
      () => Dialogue({ state, npc: 'margaret', onChange, onClose: () => {} }),
      locale,
    );
    let view = h.render();
    expect(view.html).toContain(
      core.npcs[0].name[locale === 'en' ? 'en' : 'zhCN'],
    );
    expect(core.hearts(state, 'margaret')).toBe(1);
    view.click(t('game.gift', locale));
    view = h.render();
    const before = state.inventory.tea;
    const giftButton = view.buttons.find((b) => b.label.includes('× 2'))!;
    giftButton.click();
    expect(state.day.gifted).toContain('margaret');
    expect(Object.values(state.inventory).reduce((a, b) => a + b, 0)).toBe(5);
    expect(state.friendship.margaret).toBeGreaterThan(100);
    expect(state.inventory.tea).toBeLessThanOrEqual(before);
    view = h.render();
    expect(
      view.buttons.find((b) => b.label === t('game.giftDone', locale))
        ?.disabled,
    ).toBe(true);
    state = {
      ...state,
      day: { ...state.day, talked: [] },
      friendship: { margaret: 190 },
    };
    state = core.talk(state, 'margaret');
    expect(core.currentEvent(state)?.speaker).toBe('margaret');
    view = h.render();
    const heartEvent = core.currentEvent(state)!;
    const paragraphs =
      heartEvent.text[locale === 'en' ? 'en' : 'zhCN'].split('\n');
    for (let index = 0; index < paragraphs.length; index++) {
      view.click(t('game.reveal', locale));
      view = h.render();
      if (index < paragraphs.length - 1) {
        view.click(t('game.continuePlaying', locale));
        view = h.render();
      }
    }
    view.click(heartEvent.choices[0].label[locale === 'en' ? 'en' : 'zhCN']);
    expect(state.pendingEvent).toBeUndefined();
    expect(state.firedEvents).toContain(heartEvent.id);
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
    h.dispose();
  },
);

test.each(['zh-CN', 'en'] as const)(
  'heart scenes type and reveal one paragraph at a time before offering choices in %s',
  (locale) => {
    vi.useFakeTimers();
    let state = active(locale);
    state.friendship.margaret = 190;
    state = core.talk(state, 'margaret');
    const event = core.currentEvent(state)!;
    const key = locale === 'en' ? 'en' : 'zhCN';
    const paragraphs = event.text[key].split('\n');
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    const onChange = vi.fn((next: GameState) => {
      state = next;
    });
    const h = harness(
      () => Dialogue({ state, npc: 'margaret', onChange, onClose: vi.fn() }),
      locale,
    );
    const hasChoices = (view: ReturnType<typeof h.render>) =>
      view.buttons.some((b) => b.label.startsWith(event.choices[0].label[key]));
    for (let index = 0; index < paragraphs.length; index++) {
      h.render();
      h.flush();
      let view = h.render();
      expect(view.html).toContain(
        `aria-label="${paragraphs[index].replaceAll('"', '&quot;').replaceAll("'", '&#x27;')}"`,
      );
      expect(view.html).toContain('<span aria-hidden="true">▍</span>');
      expect(hasChoices(view)).toBe(false);
      expect(
        view.buttons.some((b) => b.label === t('game.continuePlaying', locale)),
      ).toBe(false);
      if (index < paragraphs.length - 1)
        expect(view.html).not.toContain(paragraphs[index + 1]);

      vi.advanceTimersByTime(28);
      view = h.render();
      expect(view.html).toContain(`>${paragraphs[index][0]}<span`);
      expect(hasChoices(view)).toBe(false);
      if (index === 1) {
        vi.advanceTimersByTime(28 * (paragraphs[index].length - 1));
      } else view.click(t('game.reveal', locale));
      view = h.render();
      expect(
        view.buttons.some((b) => b.label === t('game.reveal', locale)),
      ).toBe(false);
      expect(hasChoices(view)).toBe(index === paragraphs.length - 1);
      expect(onChange).not.toHaveBeenCalled();
      if (index < paragraphs.length - 1) {
        expect(view.html).not.toContain(paragraphs[index + 1]);
        view.click(t('game.continuePlaying', locale));
      }
    }
    h.render().click(event.choices[0].label[key]);
    expect(onChange).toHaveBeenCalledOnce();
    expect(state.pendingEvent).toBeUndefined();
    expect(state.firedEvents).toContain(event.id);
    h.dispose();
  },
);

test('single-paragraph phone dialogue keeps its choices while the text is typing', () => {
  const state = active();
  state.pendingEvent = 'phone';
  const onChange = vi.fn();
  const view = renderView(() =>
    Dialogue({ state, npc: 'margaret', onChange, onClose: vi.fn() }),
  );
  expect(view.html).toContain('<span aria-hidden="true">▍</span>');
  expect(view.buttons.some((b) => b.label === t('game.continuePlaying'))).toBe(
    false,
  );
  view.click('好，记下了');
  expect(onChange.mock.calls[0][0].pendingEvent).toBeUndefined();
});

test.each(['zh-CN', 'en'] as const)(
  'speakerless event text uses separate paragraphs in %s',
  (locale) => {
    const event = fixtures[1];
    const original = event.text;
    event.text = {
      zhCN: '第一段。\n第二段。\n第三段。',
      en: 'First paragraph.\nSecond paragraph.\nThird paragraph.',
    };
    try {
      const state = active(locale);
      state.pendingEvent = event.id;
      const view = renderView(
        () => EventCard({ state, onChange: vi.fn() }),
        locale,
      );
      const paragraphs =
        event.text[locale === 'en' ? 'en' : 'zhCN'].split('\n');
      for (const paragraph of paragraphs)
        expect(view.html).toContain(`>${paragraph}</p>`);
      expect(view.html.match(/<p /g)).toHaveLength(3);
      view.click(event.choices[0].label[locale === 'en' ? 'en' : 'zhCN']);
    } finally {
      event.text = original;
    }
  },
);

test('shop quantity deducts actual money and adds seeds, then plot planting/watering/harvest', () => {
  let state = at(600, 'shop');
  state.quarter = 2;
  state.day.deliveries = [];
  const onChange = (s: GameState) => {
    state = s;
  };
  const h = harness(() => Shop({ state, place: 'shop', onChange }));
  let v = h.render();
  v.input('3.5');
  v = h.render();
  const before = state.stats.money;
  v.click('买');
  expect(state.stats.money).toBe(
    before - 3 * core.items.find((i) => i.id === 'seed-potato')!.price!,
  );
  expect(state.inventory['seed-potato']).toBe(5);
  h.dispose();
  vi.restoreAllMocks();
  state = core.doActivity(core.enter(state, 'allotment'), 'rent-plot');
  expect(state.plots).toHaveLength(6);
  const plot = () => renderView(() => PlotMenu({ state, plot: 0, onChange }));
  plot().click('土豆种子');
  expect(state.inventory['seed-potato']).toBe(4);
  expect(state.plots[0].seed).toBe('seed-potato');
  plot().click('浇水');
  expect(state.plots[0].wateredOn).toBe(state.dayNumber);
  state.day.deliveries = [];
  state = core.sleep(state);
  expect(state.plots[0].growth).toBe(2);
  state = core.enter(state, 'allotment');
  plot().click('浇水');
  state = core.sleep(state);
  expect(state.plots[0].growth).toBe(4);
  state = core.enter(state, 'allotment');
  plot().click('收获');
  expect(state.plots[0].seed).toBeUndefined();
  expect(state.inventory.potato).toBeGreaterThanOrEqual(1);
});

test.each([true, false])(
  'fishing reaction window records success=%s',
  (success) => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    let state = at(600, 'pond');
    const before = { ...state.inventory };
    const change = vi.fn((s: GameState) => {
      state = s;
    });
    const h = harness(() => Fishing({ state, onChange: change }));
    h.render();
    h.flush();
    h.render().click('抛竿');
    h.render();
    vi.advanceTimersByTime(1000);
    expect(h.render().html).toContain('咬钩了');
    if (success) {
      vi.advanceTimersByTime(400);
      h.render().click('收竿');
    } else vi.advanceTimersByTime(601);
    expect(change).toHaveBeenCalledOnce();
    expect(state.outcome?.kind).toBe('catch');
    expect(state.day.minute).toBe(630);
    expect(
      Object.values(state.inventory).reduce((a, b) => a + b, 0) -
        Object.values(before).reduce((a, b) => a + b, 0),
    ).toBe(success ? 1 : 0);
    vi.advanceTimersByTime(1000);
    expect(change).toHaveBeenCalledOnce();
    h.dispose();
  },
);

test('mailbox read removes a letter, resolves an event and adds its enclosed item', () => {
  let state = active();
  const change = (s: GameState) => {
    state = s;
  };
  expect(core.mailbox(state)).toHaveLength(1);
  renderView(() => Mailbox({ state, onChange: change })).click('读下一封信');
  expect(core.mailbox(state)).toHaveLength(0);
  expect(core.currentEvent(state)?.id).toBe('letter');
  const before = state.inventory['seed-potato'];
  renderView(() => EventCard({ state, onChange: change })).click('好，记下了');
  expect(state.pendingEvent).toBeUndefined();
  expect(state.inventory['seed-potato']).toBe(before + 1);
});

test('kitchen consumes recipe ingredients and eating changes health', () => {
  let state = active();
  state.inventory.potato = 2;
  state.day.place = 'home';
  const change = (s: GameState) => {
    state = s;
  };
  renderView(() => Kitchen({ state, onChange: change })).click('烤土豆');
  expect(state.inventory.potato).toBe(1);
  expect(state.inventory['baked-potato']).toBe(1);
  const health = state.stats.health;
  state = core.eat(state, 'baked-potato');
  expect(state.inventory['baked-potato']).toBe(0);
  expect(state.stats.health).toBeGreaterThan(health);
});

test.each(['zh-CN', 'en'] as const)(
  'sleep, pending events, three days and seasonal summary in %s',
  (locale) => {
    let state = active(locale);
    const before = state;
    state = core.sleep(state);
    expect(state.dayNumber).toBe(0);
    expect(state.pendingEvent).toBeDefined();
    while (state.pendingEvent) {
      state = core.resolve(state, 'yes');
      state = core.sleep(state);
    }
    expect(state.dayNumber).toBe(1);
    expect(state.day.minute).toBe(420);
    state = core.sleep(state);
    expect(state.day.index).toBe(2);
    expect(state.dayNumber).toBe(2);
    state = core.sleep(state);
    expect(state.quarter).not.toBe(before.quarter);
    expect(state.day.index).toBe(0);
    expect(state.dayNumber).toBe(3);
    expect(state.log.filter((e) => e.kind === 'quarter')).toHaveLength(1);
    const onContinue = vi.fn();
    const v = renderView(
      () =>
        QuarterSummary({ before, after: state, onContinue, onVisit: vi.fn() }),
      locale,
    );
    expect(v.html).toContain(t('game.daysReview', locale));
    v.click(t('game.nextQuarter', locale));
    expect(onContinue).toHaveBeenCalledOnce();
    if (locale === 'en') expect(v.html).not.toMatch(cjk);
  },
);

test('fast-forward stops at every event and only finishes the current season', () => {
  let state = initial();
  const q = state.quarter;
  expect(core.fastForward(state)).toBe(state);
  const seen = [];
  for (let n = 0; n < 10 && state.quarter === q; n++) {
    if (state.pendingEvent) {
      seen.push(state.pendingEvent);
      state = core.resolve(state, 'yes');
    }
    state = core.fastForward(state);
  }
  expect(seen).toContain('morning');
  expect(seen).toContain('phone');
  expect(state.log.filter((e) => e.id === 'relax')).toHaveLength(1);
  expect(state.log.some((e) => e.id === 'work')).toBe(true);
  expect(seen).toContain('letter');
  expect(state.dayNumber).toBe(3);
  expect(state.log.filter((l) => l.kind === 'quarter')).toHaveLength(1);
  expect(state.day.minute).toBe(420);
});

test('v3 saves restore inventories and random cursor; v2 and invalid saves are never read', () => {
  const state = active();
  storage.set(
    `uk-immigration-life-v2:${state.characterId}`,
    JSON.stringify(state),
  );
  expect(gameStorage(state.characterId).state).toBeUndefined();
  gameStorage(state.characterId, state);
  expect(gameStorage(state.characterId).state).toEqual(state);
  for (const change of [
    { version: 2 },
    { day: undefined },
    { inventory: { tea: -1 } },
    { plots: [null] },
    { day: { ...state.day, minute: 2000 } },
    { pendingEvent: 'missing' },
  ]) {
    storage.set(
      `uk-immigration-life-v3:${state.characterId}`,
      JSON.stringify({ ...state, clientVersion: 1, ...change }),
    );
    expect(gameStorage(state.characterId).available).toBe(false);
  }
  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw Error();
    },
    setItem: () => {
      throw Error();
    },
  });
  expect(gameStorage(state.characterId, state)).toEqual({
    state,
    available: false,
  });
  expect(core.tick(state, 10).day.minute).toBe(430);
});

test('language replacement preserves timeline, random state, inventory and simulator export', () => {
  const state = active();
  const next = withGameLocale(state, 'en');
  expect(next).toEqual({
    ...state,
    locale: 'en',
    result: evaluate({
      timeline: state.timeline,
      simulationDate: state.date,
      locale: 'en',
    }),
  });
  expect(next.inventory).toBe(state.inventory);
  expect(next.randomState).toBe(state.randomState);
  expect(decodeDraft(encodeDraft(gameDraft(next)))!.timeline).toEqual(
    state.timeline,
  );
});

test('all new overlays are English-only, with an unknown-item fallback', () => {
  const state = at(720, 'shop', 'en');
  state.plots = [{ growth: 0 }];
  state.inventory['future-item'] = 1;
  expect(itemIcon('future-item')).toBe('/game/assets/indoor/item.png');
  const views = [
    () => Inventory({ state, onChange: vi.fn(), onKitchen: vi.fn() }),
    () => Shop({ state, place: 'shop', onChange: vi.fn() }),
    () => PlotMenu({ state, plot: 0, onChange: vi.fn() }),
    () => Kitchen({ state, onChange: vi.fn() }),
    () => Mailbox({ state, onChange: vi.fn() }),
    () => Fishing({ state, onChange: vi.fn() }),
    () => ItemIcon({ id: 'future-item' }),
    () => Ending({ state: { ...state, ending: 'left' }, onChange: vi.fn() }),
    () => ProgressBars({ state, onOpen: vi.fn() }),
  ];
  for (const make of views)
    expect(renderView(make, 'en').html).not.toMatch(cjk);
});

function client(start: GameState) {
  const documentStub = {
    hidden: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('document', documentStub);
  gameStorage(start.characterId, start);
  const h = harness(() => GameClient());
  h.render();
  h.flush();
  const selection = h.render().props(CharacterSelect);
  selection.onChange(start);
  h.render().props(TownCanvas).onReady();
  h.render();
  h.flush();
  return { ...h, documentStub };
}
test('controller clock ticks only outdoors; menus, events, hidden page and morning pause it', () => {
  vi.useFakeTimers();
  const start = at(480);
  const h = client(start);
  const v = h.render();
  const get = () => h.render().props(TownCanvas).state;
  vi.advanceTimersByTime(2000);
  expect(get().day.minute).toBe(480);
  v.props(TownCanvas).onInteract({ kind: 'home', id: 'exit' });
  h.render();
  h.flush();
  vi.advanceTimersByTime(2000);
  expect(get().day.minute).toBe(490);
  h.render();
  h.flush();
  h.render().click('背包');
  h.render();
  h.flush();
  vi.advanceTimersByTime(4000);
  expect(get().day.minute).toBe(490);
  h.render().props(Modal).onClose!();
  h.render();
  h.flush();
  h.documentStub.hidden = true;
  const handler = h.documentStub.addEventListener.mock.calls.find(
    (c) => c[0] === 'visibilitychange',
  )![1] as () => void;
  handler();
  h.render();
  h.flush();
  vi.advanceTimersByTime(4000);
  expect(get().day.minute).toBe(490);
  h.documentStub.hidden = false;
  handler();
  h.render();
  h.flush();
  vi.advanceTimersByTime(2000);
  expect(get().day.minute).toBe(500);
  h.dispose();
});

test('controller sleeping resumes after delivery then shows exactly one new morning', () => {
  vi.useFakeTimers();
  const h = client(at(600));
  h.render().click('今天到此为止');
  h.render().click('确认');
  h.render();
  h.flush();
  vi.advanceTimersByTime(280);
  h.render();
  h.flush();
  for (let i = 0; i < 5; i++) {
    h.render();
    h.flush();
    const state = h.render().props(TownCanvas).state;
    if (state.pendingEvent) {
      const v = h.render();
      if (core.currentEvent(state)?.speaker)
        v.props(Dialogue).onChange(core.resolve(state, 'yes'));
      else v.props(EventCard).onChange(core.resolve(state, 'yes'));
    } else break;
  }
  h.render();
  h.flush();
  const v = h.render();
  expect(v.props(TownCanvas).state.dayNumber).toBe(1);
  expect(v.props(MorningCard).state.day.minute).toBe(420);
  expect(v.props(TownCanvas).paused).toBe(true);
  h.dispose();
});

test('fresh controller waits for scene and morning before exposing the initial event', () => {
  vi.useFakeTimers();
  const h = client(initial());
  let v = h.render();
  expect(v.props(MorningCard).state.dayNumber).toBe(0);
  v.props(MorningCard).onContinue();
  v = h.render();
  expect(v.props(EventCard).state.pendingEvent).toBe('morning');
  h.dispose();
});

test('display workday is a weekday without moving the policy anchor date', () => {
  for (const character of core.characters) {
    const state = initial('en', character.id);
    expect(state.date).toBe(character.startDate);
    expect([1, 2, 3, 4, 5]).toContain(new Date(state.day.date).getUTCDay());
  }
});

test('midnight returns home and sleeps automatically after remaining events', () => {
  vi.useFakeTimers();
  const state = at(1430, 'bench');
  state.day.deliveries = [];
  const h = client(state);
  vi.advanceTimersByTime(2000);
  for (let i = 0; i < 4; i++) {
    h.render();
    h.flush();
  }
  const view = h.render();
  expect(view.props(TownCanvas).state.dayNumber).toBe(1);
  expect(view.props(TownCanvas).interior).toBe(true);
  expect(view.props(MorningCard).state.day.minute).toBe(420);
  h.dispose();
});

test('final season leads to the ending without another morning event', () => {
  const state = active('en');
  state.year = 10;
  state.quarter = 4;
  state.log = Array.from({ length: 39 }, (_, i) => ({
    year: Math.floor(i / 4) + 1,
    quarter: ((i % 4) + 1) as core.Quarter,
    kind: 'quarter',
    id: 'quarter',
    text: { zhCN: '季末', en: 'Quarter' },
  }));
  state.day.index = 2;
  state.day.deliveries = [];
  const after = core.sleep(state);
  expect(core.isOver(after)).toBe(true);
  expect(after.pendingEvent).toBeUndefined();
  expect(after.day.deliveries).toEqual([]);
  const ending = renderView(
    () => Ending({ state: after, onChange: vi.fn() }),
    'en',
  );
  expect(ending.html).toContain('href="/result#s=');
  expect(ending.html).not.toMatch(cjk);
});

test('hours render from places, and core filters activities that cannot finish before closing', () => {
  const place = core.places.find((p) => p.id === 'work')!;
  const original = place.hours;
  try {
    place.hours = { opens: 600, closes: 1200, dayKinds: ['workday'] };
    const state = at(590, 'work');
    const menu = renderView(() =>
      LocationMenu({ state, location: 'work', onChange: vi.fn() }),
    );
    expect(menu.html).toContain('10:00–20:00');
    expect(menu.html).toContain(t('game.closed'));
    state.day.minute = 900;
    expect(core.activities(state, 'work').some((a) => a.id === 'work')).toBe(
      false,
    );
    expect(
      renderView(() =>
        LocationMenu({ state, location: 'work', onChange: vi.fn() }),
      ).buttons.some((b) => b.label.startsWith('上班')),
    ).toBe(false);
  } finally {
    place.hours = original;
  }
});

test.each(core.characters)(
  '$id household members leave both maps while away and return home afterwards',
  (character) => {
    const state = core.newGame(character.id, 42, 'en');
    state.day.kind = 'workday';
    state.day.weather = 'sunny';
    delete state.day.festival;
    state.day.minute = 480;
    const family = core
      .townsfolk(state)
      .filter((npc) => npc.characters?.includes(character.id));
    expect(family.length).toBeGreaterThan(0);
    for (const npc of family)
      expect(visibleResidents(state, true)).toContain(npc);
    state.day.minute = 660;
    for (const npc of family) {
      expect(core.npcAt(state, npc.id)).toBe('away');
      expect(visibleResidents(state, true)).not.toContain(npc);
      expect(visibleResidents(state, false)).not.toContain(npc);
      expect(core.townsfolk(state)).toContain(npc);
    }
    state.day.minute = 1080;
    for (const npc of family)
      expect(visibleResidents(state, true)).toContain(npc);
  },
);

test('flatmate uses a distinct existing 64 by 48 PNG sprite sheet', () => {
  const path = spritePath('yao-flatmate');
  expect(path).toBe('/game/assets/urban/yao-flatmate.png');
  const sprite = readFileSync(new URL(`../public${path}`, import.meta.url));
  expect(sprite.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  expect([sprite.readUInt32BE(16), sprite.readUInt32BE(20)]).toEqual([64, 48]);
  const player = readFileSync(
    new URL(`../public${spritePath('skilled-worker')}`, import.meta.url),
  );
  expect(sprite.equals(player)).toBe(false);
});

test('home residents use fixed accessible positions and never appear in the town while home', () => {
  // Jamie is real household data since 9.3; mornings are spent at home.
  const state = core.newGame('family-partner', 42, 'en');
  delete state.pendingEvent;
  state.eventQueue = [];
  state.day.deliveries = [];
  expect(visibleResidents(state, true).map((n) => n.id)).toEqual(['jamie']);
  expect(visibleResidents(state, false).some((n) => n.id === 'jamie')).toBe(
    false,
  );
  // Yao's flatmate is at home before leaving for work.
  expect(visibleResidents(active(), true).map((n) => n.id)).toEqual([
    'yao-flatmate',
  ]);
  // Away at work: drawn neither at home nor in the town.
  const working = active();
  working.day.weather = 'sunny';
  working.day.minute = 660;
  expect(core.npcAt(working, 'yao-flatmate')).toBe('away');
  expect(visibleResidents(working, true)).toEqual([]);
  expect(
    visibleResidents(working, false).some((n) => n.id === 'yao-flatmate'),
  ).toBe(false);
  expect(core.peopleAt(state, 'home')).toContain('jamie');
  const chatted = core.talk(state, 'jamie');
  expect(chatted.day.talked).toContain('jamie');
  expect(
    renderView(
      () =>
        Dialogue({
          state: chatted,
          npc: 'jamie',
          onChange: vi.fn(),
          onClose: vi.fn(),
        }),
      'en',
    ).html,
  ).toContain('Jamie');
  const collision = homeMap.layers.find((l) => l.name === 'collision')!;
  for (let index = 0; index < 3; index++) {
    const spot = homeSpot(index);
    expect(collision.data![spot.y * homeMap.width + spot.x]).toBe(0);
  }
});

test('controller clears gift feedback before a shop, mailbox, or reopened menu', () => {
  const h = client(at(600));
  h.render().props(TownCanvas).onInteract({ kind: 'npc', id: 'margaret' });
  const dialogue = h.render().props(Dialogue);
  const next = core.gift(dialogue.state, 'margaret', 'tea');
  dialogue.onChange(next);
  expect(h.render().props(Dialogue).feedbackText).toEqual(next.outcome?.text);
  h.render().props(Modal).onClose!();
  h.render().props(TownCanvas).onInteract({ kind: 'place', id: 'shop' });
  expect(h.render().props(OutcomeText).text).toBeUndefined();
  expect(
    h
      .render()
      .buttons.filter((b) => ['家', '公司', '街角小店'].includes(b.label))
      .every((b) => b.disabled),
  ).toBe(true);
  const shop = h.render().props(Shop);
  shop.onChange(core.buy(shop.state, 'tea', 1));
  expect(h.render().props(OutcomeText).text).toEqual(
    core.items.find((i) => i.id === 'tea')!.name,
  );
  h.render().props(Modal).onClose!();
  h.render().props(TownCanvas).onInteract({ kind: 'place', id: 'shop' });
  expect(h.render().props(OutcomeText).text).toBeUndefined();
  h.dispose();
});

test('reading the board keeps the menu open with this season\u2019s notices', () => {
  const h = client(at(600, 'board'));
  h.render().props(TownCanvas).onInteract({ kind: 'place', id: 'board' });
  const menu = h.render().props(LocationMenu);
  const next = core.doActivity(menu.state, 'board');
  menu.onChange(next);
  expect(next.outcome?.text?.zhCN).toBeTruthy();
  expect(h.render().props(OutcomeText).text).toEqual(next.outcome?.text);
  h.dispose();
});

test('outcome text renders each notice on a separate line in both locales', () => {
  const outcome: core.Outcome = {
    kind: 'activity',
    text: {
      zhCN: '本季公告\n周末捡垃圾\n夏日菜地评比',
      en: 'Season notices\nWeekend litter pick\nSummer allotment show',
    },
  };
  for (const locale of ['zh-CN', 'en'] as const) {
    const { html } = renderView(
      () => OutcomeText({ text: outcome.text }),
      locale,
    );
    const lines = outcome.text![locale === 'en' ? 'en' : 'zhCN'].split('\n');
    expect(html).toContain(lines.join('<br/>'));
    expect(html.match(/<br\/>/g)).toHaveLength(2);
    expect(html).toContain('role="status"');
  }
});

test('heart dialogue focuses the NPC and shows the actual heart change', () => {
  const start = at(600);
  start.friendship.margaret = 190;
  const h = client(start);
  h.render().props(TownCanvas).onInteract({ kind: 'npc', id: 'margaret' });
  const view = h.render();
  expect(view.props(TownCanvas).focusNpc).toBe('margaret');
  expect(view.props(Dialogue).heartChange).toEqual({ before: 1, after: 2 });
  expect(view.html).toContain('♥ 1 → 2');
  h.dispose();
});

test('one-month journey pauses abroad, restores there, and records only a completed absence on return', () => {
  const start = at(600, 'station');
  const h = client(start);
  h.render().props(TownCanvas).onInteract({ kind: 'place', id: 'station' });
  const menu = h.render().props(LocationMenu);
  menu.onChange(core.doActivity(menu.state, 'travel-1'));
  let view = h.render();
  expect(view.props(TravelCard).state.trip).toBeDefined();
  expect(view.props(TravelCard).state.timeline.absences).toEqual(
    start.timeline.absences,
  );
  expect(view.html).not.toContain('role="application"');
  const abroad = view.props(TravelCard).state;
  gameStorage(abroad.characterId, abroad);
  expect(gameStorage(abroad.characterId).state!.trip).toEqual(abroad.trip);
  for (let i = 0; i < 15; i++) {
    view = h.render();
    const card = view.props(TravelCard);
    if (card.returned) break;
    const state = card.state;
    if (state.pendingEvent) {
      const event = core.currentEvent(state)!;
      const next = core.resolve(state, event.choices[0].id);
      if (event.speaker || event.heart) view.props(Dialogue).onChange(next);
      else view.props(EventCard).onChange(next);
    } else card.onContinue();
  }
  view = h.render();
  const returned = view.props(TravelCard);
  expect(returned.returned).toBeDefined();
  expect(returned.state.trip).toBeUndefined();
  expect(returned.state.timeline.absences).toHaveLength(
    start.timeline.absences.length + 1,
  );
  expect(
    returned.state.timeline.absences.every((a) => a.to <= returned.state.date),
  ).toBe(true);
  expect(
    view.props(QuarterSummary).after.log.some((e) => e.kind === 'quarter'),
  ).toBe(true);
  returned.onContinue();
  expect(h.render().props(TownCanvas).interior).toBe(true);
  h.dispose();
});

test('real fast-forward diary groups all three days and merges repeat conversations', () => {
  let state = active('en');
  state.day.deliveries = [];
  let diary: DayMemory[] = [];
  for (let i = 0; i < 2; i++) {
    const next = core.talk(state, 'margaret');
    diary = recordMemories(diary, state, next, 'action');
    state = next;
  }
  const before = state;
  const after = core.fastForward(state);
  diary = recordMemories(diary, state, after, 'fast');
  const groups = groupedMemories(diary, before.year, before.quarter);
  expect(groups[0].find((m) => m.key.startsWith('talk:'))!.count).toBe(2);
  expect(groups[0].some((m) => m.key === 'action:work:')).toBe(true);
  expect(groups[1].some((m) => m.key === 'action:rest:')).toBe(true);
  expect(groups[1].some((m) => m.key === 'action:relax:')).toBe(true);
  expect(groups[2].some((m) => m.key === 'action:festival:')).toBe(true);
  const view = renderView(
    () =>
      QuarterSummary({
        before,
        after,
        diary,
        onContinue: vi.fn(),
        onVisit: vi.fn(),
      }),
    'en',
  );
  for (let i = 1; i <= 3; i++)
    expect(view.html).toContain(
      t('game.day', 'en').replace('{day}', String(i)),
    );
  expect(view.html).toContain('× 2');
  expect(view.html).not.toMatch(cjk);
  gameStorage(after.characterId, after, diary);
  expect(gameStorage(after.characterId).diary).toEqual(diary);
});

test('unassigned real event queue restores, but mock-era v3 saves are ignored', () => {
  const state = core.newGame(core.characters[0].id, 4, 'en');
  delete state.pendingEvent;
  state.eventQueue = ['letter'];
  gameStorage(state.characterId, state);
  expect(gameStorage(state.characterId).state?.eventQueue).toEqual(['letter']);
  storage.set(
    `uk-immigration-life-v3:${state.characterId}`,
    JSON.stringify(state),
  );
  expect(gameStorage(state.characterId).state).toBeUndefined();
});

test('Tiled layers retain finite offsets, opacity and visibility after map regeneration', () => {
  for (const map of [townMap, homeMap])
    for (const layer of map.layers) {
      expect(Number.isFinite(layer.x)).toBe(true);
      expect(Number.isFinite(layer.y)).toBe(true);
      expect(layer.opacity).toBeGreaterThanOrEqual(0);
      expect(layer.opacity).toBeLessThanOrEqual(1);
      expect(typeof layer.visible).toBe('boolean');
    }
});

test.each(core.festivals)(
  'festival $id reads its title, text and activities from real data',
  (festival) => {
    const state = at(1080, 'green', 'en');
    state.day.festival = festival.id;
    state.day.kind = 'special';
    state.day.index = 2;
    state.day.deliveries = [];
    const changed = vi.fn();
    const menu = renderView(
      () => LocationMenu({ state, location: 'green', onChange: changed }),
      'en',
    );
    expect(menu.html).toContain(festival.name.en);
    expect(menu.html).not.toMatch(cjk);
    const activity = core.activities(state, 'green')[0];
    menu.click(activity.label.en);
    expect(changed.mock.lastCall![0].day.done).toContain(activity.id);
  },
);

test('rejected late fishing never claims a catch or changes the state', () => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  vi.stubGlobal('window', {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  const state = at(1435, 'pond');
  const onChange = vi.fn();
  const h = harness(() => Fishing({ state, onChange }));
  h.render().click(t('game.cast'));
  h.render();
  vi.advanceTimersByTime(1000);
  h.render().click(t('game.reel'));
  expect(onChange).not.toHaveBeenCalled();
  expect(h.render().html).toContain(t('game.actionUnavailable'));
  expect(h.render().html).not.toContain(t('game.fishWin'));
  h.dispose();
});

test('controller resolves a phone interruption without replaying or dropping the remaining work time', () => {
  const start = at(540, 'work');
  start.day.deliveries = [{ eventId: 'phone', channel: 'phone', minute: 720 }];
  const h = client(start);
  h.render().props(TownCanvas).onInteract({ kind: 'place', id: 'work' });
  const menu = h.render().props(LocationMenu);
  menu.onChange(core.doActivity(menu.state, 'work'));
  let state = h.render().props(TownCanvas).state;
  expect(state.day.minute).toBe(720);
  expect(state.day.resumeMinute).toBe(1020);
  h.render().props(EventCard).onChange(core.resolve(state, 'yes'));
  state = h.render().props(TownCanvas).state;
  expect(state.day.minute).toBe(1020);
  expect(state.day.resumeMinute).toBeUndefined();
  expect(state.log.filter((l) => l.id === 'work')).toHaveLength(1);
  h.dispose();
});

test('season opening stats survive reload and include daily life changes in the summary', () => {
  const start = at(600);
  const opening = { ...start.stats };
  const afterMeal = core.eat(start, 'tea');
  gameStorage(afterMeal.characterId, afterMeal, [], opening);
  expect(gameStorage(afterMeal.characterId).quarterStart).toEqual(opening);
  const settled = {
    ...afterMeal,
    stats: { ...afterMeal.stats, mood: afterMeal.stats.mood + 3 },
  };
  const summary = renderView(() =>
    QuarterSummary({
      before: afterMeal,
      after: settled,
      startStats: opening,
      onContinue: vi.fn(),
      onVisit: vi.fn(),
    }),
  );
  const changes = summary.html;
  expect(changes).toContain(`+${settled.stats.mood - opening.mood}`);
});

test('sleeping through a promotion generates feedback and still shows the final quarter summary', () => {
  vi.useFakeTimers();
  const start = at(1200);
  start.day.index = 2;
  start.day.deliveries = [];
  start.stats.career = 60;
  const h = client(start);
  h.render().click(t('game.endDay'));
  h.render().click(t('game.confirm'));
  h.render();
  h.flush();
  vi.advanceTimersByTime(280);
  h.render();
  h.flush();
  const view = h.render();
  expect(view.props(TownCanvas).feedback?.promotion).toBe(true);
  expect(view.props(QuarterSummary).startStats).toEqual(start.stats);
  h.dispose();
});

test.each(core.characters)(
  'real $id can complete a day using real work, pub, shop, mail and sleep transitions',
  (character) => {
    let state = core.newGame(character.id, 42, 'en');
    const resolvePending = () => {
      for (let i = 0; i < 10 && state.pendingEvent; i++)
        state = core.resolve(state, core.currentEvent(state)!.choices[0].id);
    };
    resolvePending();
    state = core.tick(state, 540 - state.day.minute);
    resolvePending();
    state = core.enter(state, 'work');
    resolvePending();
    state = core.doActivity(state, 'work');
    resolvePending();
    expect(state.day.done).toContain('work');
    state = core.enter(state, 'shop');
    resolvePending();
    state = core.buy(state, 'tea', 1);
    expect(state.inventory.tea).toBeGreaterThan(0);
    state = core.tick(state, Math.max(0, 1080 - state.day.minute));
    resolvePending();
    state = core.enter(state, 'pub');
    resolvePending();
    const menu = renderView(
      () =>
        LocationMenu({
          state,
          location: 'pub',
          onChange: (next) => {
            state = next;
          },
        }),
      'en',
    );
    menu.click(
      core.activities(state, 'pub').find((a) => a.id === 'relax')!.label.en,
    );
    expect(state.day.done).toContain('relax');
    resolvePending();
    state = core.enter(state, 'home');
    resolvePending();
    if (core.mailbox(state).length) {
      state = core.readMail(state);
      resolvePending();
    }
    const day = state.dayNumber;
    for (let i = 0; i < 10 && state.dayNumber === day; i++) {
      state = core.sleep(state);
      resolvePending();
    }
    expect(state.dayNumber).toBe(day + 1);
    expect(state.day.place).toBe('home');
    expect(
      renderView(() => MorningCard({ state, onContinue: vi.fn() }), 'en').html,
    ).not.toMatch(cjk);
  },
);
