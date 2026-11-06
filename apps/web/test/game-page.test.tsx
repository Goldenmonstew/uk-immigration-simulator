import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { evaluate, type Locale } from '@uk-immigration/engine';
import * as core from '../app/game/mock-core';
import type { GameState } from '../app/game/mock-core';
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
} from '../app/game/life-overlays';
import {
  gameStorage,
  gameDraft,
  itemIcon,
  spritePath,
  withGameLocale,
} from '../app/game/session';
import { t } from '../i18n';
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
const initial = (locale: Locale = 'zh-CN', id = core.characters[0].id) =>
  core.newGame(id, 42, locale);
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
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, v: string) => storage.set(key, v),
  });
});
afterEach(() => {
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
    expect(closed.html).toContain('08:00–20:00');
    expect(closed.html).toContain(t('game.closed', locale));
    expect(closed.buttons).toHaveLength(0);
    state = at(540, 'work', locale);
    const onTalk = vi.fn();
    const menu = renderView(
      () => LocationMenu({ state, location: 'work', onChange, onTalk }),
      locale,
    );
    menu.click(locale === 'en' ? 'Work until' : '上班到');
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
    for (const place of ['council', 'visa'] as const)
      expect(core.activities(state, place).length).toBeGreaterThan(0);
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
      friendship: { margaret: 100 },
    };
    state = core.talk(state, 'margaret');
    expect(core.currentEvent(state)?.speaker).toBe('margaret');
    view = h.render();
    view.click(locale === 'en' ? 'All right' : '好，记下了');
    expect(state.pendingEvent).toBeUndefined();
    expect(state.firedEvents).toContain('heart-margaret');
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
    h.dispose();
  },
);

test('shop quantity deducts actual money and adds seeds, then plot planting/watering/harvest', () => {
  let state = at(600, 'shop');
  const onChange = (s: GameState) => {
    state = s;
  };
  const h = harness(() => Shop({ state, place: 'shop', onChange }));
  let v = h.render();
  v.input('3.5');
  v = h.render();
  const before = state.stats.money;
  v.click('买');
  expect(state.stats.money).toBe(before - 12);
  expect(state.inventory['seed-potato']).toBe(5);
  h.dispose();
  vi.restoreAllMocks();
  state = core.doActivity(core.enter(state, 'allotment'), 'rent');
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
  plot().click('浇水');
  state = core.sleep(state);
  expect(state.plots[0].growth).toBe(4);
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
    expect(state.day.minute).toBe(620);
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
  expect(state.log.filter((e) => e.id === 'relax')).toHaveLength(2);
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
      JSON.stringify({ ...state, ...change }),
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
