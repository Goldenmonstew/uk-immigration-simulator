import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { evaluate, type Locale } from '@uk-immigration/engine';
import * as core from '../app/game/mock-core';
import type { GameState } from '../app/game/mock-core';
import GameClient from '../app/game/game-client';
import {
  ActionFeedback,
  CharacterSelect,
  Ending,
  EventCard,
  LocationMenu,
  ProgressBars,
  ProgressDetail,
  QuarterSummary,
  StatusBar,
} from '../app/game/game-view';
import { gameDraft, gameStorage, withGameLocale } from '../app/game/session';
import Home from '../app/home-content';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { displayedRuleSets } from '../lib/policy';
import { runSimulation } from '../lib/questionnaire';
import { decodeDraft, encodeDraft } from '../lib/share';

vi.mock('react', { spy: true });
vi.mock('../app/game/town-canvas', () => ({ default: () => null }));

const storage = new Map<string, string>();
const originalCharacters = [...core.characters];
const cjk = /[\u3400-\u9fff]/;
const keyFor = (id: string) => `uk-immigration-life-v2:${id}`;
const getItem = vi.fn((key: string) => storage.get(key) ?? null);
const language = (locale: Locale) => (locale === 'en' ? 'en' : 'zhCN');
const initial = (locale: Locale = 'zh-CN') =>
  core.newGame(core.characters[0].id, 7, locale);

beforeEach(() => {
  storage.clear();
  getItem.mockClear();
  vi.stubGlobal('localStorage', {
    getItem,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});
afterEach(() => {
  core.characters.splice(0, core.characters.length, ...originalCharacters);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

type ElementProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};
function walk(
  node: React.ReactNode,
  visit: (element: React.ReactElement<ElementProps>) => void,
) {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement<ElementProps>(child)) return;
    visit(child);
    walk(child.props.children, visit);
  });
}
function textContent(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((child) =>
      React.isValidElement<ElementProps>(child)
        ? textContent(child.props.children)
        : String(child),
    )
    .join('');
}
function renderView(make: () => React.ReactNode, locale: Locale = 'zh-CN') {
  const buttons: { label: string; click: () => void; disabled?: boolean }[] =
    [];
  let tree: React.ReactNode;
  function Probe() {
    tree = make();
    walk(tree, (element) => {
      if (element.type === 'button' && element.props.onClick)
        buttons.push({
          label: textContent(element.props.children),
          click: element.props.onClick,
          disabled: element.props.disabled,
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
      const button = buttons.find((item) => item.label.startsWith(prefix));
      expect(button, `Expected button starting with ${prefix}`).toBeDefined();
      expect(button!.disabled).not.toBe(true);
      button!.click();
    },
    props<P extends object>(component: React.JSXElementConstructor<P>): P {
      let found: P | undefined;
      walk(tree, (element) => {
        if (element.type === component) found = element.props as P;
      });
      expect(found, 'Expected child component').toBeDefined();
      return found!;
    },
  };
}
function finishGame(locale: Locale = 'zh-CN') {
  let state = initial(locale);
  for (let quarter = 0; quarter < 4; quarter++) {
    state = core.act(state, 'work');
    const event = core.currentEvent(state);
    if (event) state = core.resolve(state, event.choices[0].id);
    state = core.endQuarter(state);
  }
  expect(core.isOver(state)).toBe(true);
  return state;
}

test.each(['zh-CN', 'en'] as const)(
  'homepage and arbitrary character lists support start and continue in %s',
  (locale) => {
    const home = renderView(() => <Home />, locale).html;
    expect(home).toContain('href="/game"');
    expect(home).toContain(t('game.entry', locale));
    vi.spyOn(Date, 'now').mockReturnValue(2 ** 31 + 42);
    for (const count of [1, 4]) {
      const characters = Array.from({ length: count }, (_, index) => ({
        ...originalCharacters[0],
        id: `character-${index}`,
        name: { zhCN: `角色 ${index}`, en: `Character ${index}` },
        intro: { zhCN: `简介 ${index}`, en: `Introduction ${index}` },
      }));
      core.characters.splice(0, core.characters.length, ...characters);
      const onChange = vi.fn<(state: GameState) => void>();
      const saved = core.act(
        core.newGame(characters[0].id, 7, 'zh-CN'),
        'work',
      );
      const view = renderView(
        () =>
          CharacterSelect({ saves: { [saved.characterId]: saved }, onChange }),
        locale,
      );
      expect(view.buttons).toHaveLength(count + 1);
      for (const character of characters) {
        expect(view.html).toContain(character.name[language(locale)]);
        expect(view.html).toContain(character.intro[language(locale)]);
        expect(view.html).toContain(character.sprite);
      }
      view.click(t('game.continue', locale));
      expect(onChange).toHaveBeenLastCalledWith(withGameLocale(saved, locale));
      view.click(
        t('game.startAs', locale).replace(
          '{name}',
          characters.at(-1)!.name[language(locale)],
        ),
      );
      expect(onChange).toHaveBeenLastCalledWith(
        core.newGame(characters.at(-1)!.id, 42, locale),
      );
      if (locale === 'en') expect(view.html).not.toMatch(cjk);
    }
  },
);

test.each(['zh-CN', 'en'] as const)(
  'HUD renders five stats, cash, quarter and a six-month expiry warning in %s',
  (locale) => {
    let state = initial(locale);
    const before = renderView(() => StatusBar({ state }), locale).html;
    expect(before.match(/<meter /g)).toHaveLength(5);
    expect(before).toContain('£4,200');
    expect(before).toContain(state.date);
    for (const stat of core.statKeys)
      expect(before).toContain(`aria-label="${t(`game.${stat}`, locale)}"`);
    expect(before).not.toContain(`title="${t('game.visaUrgent', locale)}"`);
    state = core.endQuarter(core.endQuarter(state));
    expect(core.visaMonthsLeft(state)).toBe(6);
    const after = renderView(() => StatusBar({ state }), locale).html;
    expect(after).toContain(`title="${t('game.visaUrgent', locale)}"`);
    expect(after).toContain(t('game.visa', locale).replace('{count}', '6'));
    expect(after).toContain(t('game.season3', locale));
    if (locale === 'en') expect(after).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'all eight location menus filter actions and town hall retains engine explanations and sources in %s',
  (locale) => {
    const state = initial(locale);
    for (const { id } of core.locations) {
      const onChange = vi.fn<(state: GameState) => void>();
      const view = renderView(
        () => LocationMenu({ state, location: id, onChange }),
        locale,
      );
      const actions = core
        .actions(state)
        .filter((action) => action.location === id);
      expect(view.buttons).toHaveLength(actions.length);
      for (const action of actions) {
        expect(view.html).toContain(action.label[language(locale)]);
        if (action.cost) expect(view.html).toContain(`£${action.cost}`);
        view.click(action.label[language(locale)]);
        const next = onChange.mock.lastCall![0];
        expect(next).toEqual(core.act(state, action.id));
        expect(next.actionsLeft).toBe(state.actionsLeft - 1);
      }
      for (const action of core
        .actions(state)
        .filter((action) => action.location !== id))
        expect(view.html).not.toContain(
          `<strong>${action.label[language(locale)]}</strong>`,
        );
      if (id === 'council') {
        expect(view.html).toContain(t('result.why', locale));
        for (const { id: ruleSet } of displayedRuleSets) {
          const assessment = state.result.byRuleSet[ruleSet]!;
          expect(view.html).toContain(
            t(`outcome.${assessment.outcome}`, locale),
          );
          for (const rule of assessment.rules) {
            expect(view.html).toContain(
              renderToStaticMarkup(<>{rule.explanation}</>),
            );
            for (const source of rule.sources)
              expect(view.html).toContain(source.srcId);
          }
        }
      }
      if (locale === 'en') expect(view.html).not.toMatch(cjk);
    }
    const work = core.act(state, 'work');
    expect(work.stats.money).toBeGreaterThan(state.stats.money);
    expect(work.stats.career).toBeGreaterThan(state.stats.career);
    const rest = core.act(state, 'rest');
    expect(rest.stats.health).toBeGreaterThan(state.stats.health);
    expect(rest.stats.mood).toBeGreaterThan(state.stats.mood);
    const exhausted = renderView(
      () =>
        LocationMenu({
          state: { ...state, actionsLeft: 0 },
          location: 'work',
          onChange: vi.fn(),
        }),
      locale,
    );
    expect(exhausted.buttons).toHaveLength(0);
    expect(exhausted.html).toContain(t('game.noActions', locale));
  },
);

test.each(['zh-CN', 'en'] as const)(
  'event choices resolve pending state, show deltas and flag timeline changes in %s',
  (locale) => {
    const resolve = vi.spyOn(core, 'resolve');
    let state = initial(locale);
    for (let quarter = 0; quarter < 3; quarter++) {
      state = core.act(state, 'work');
      const event = core.currentEvent(state)!;
      const choice = event.choices[0];
      const onChange = vi.fn<(state: GameState) => void>();
      const eventView = renderView(
        () => EventCard({ state, onChange }),
        locale,
      );
      expect(eventView.buttons).toHaveLength(event.choices.length);
      expect(eventView.html).toContain(
        renderToStaticMarkup(<>{event.text[language(locale)]}</>),
      );
      if (choice.note)
        expect(eventView.html).toContain(
          renderToStaticMarkup(<>{choice.note[language(locale)]}</>),
        );
      eventView.click(choice.label[language(locale)]);
      expect(resolve).toHaveBeenLastCalledWith(state, choice.id);
      const next = onChange.mock.lastCall![0];
      expect(core.currentEvent(next)).toBeUndefined();
      expect(next.firedEvents).toContain(event.id);
      expect(next.log.at(-1)?.choiceId).toBe(choice.id);
      const onContinue = vi.fn();
      const feedback = renderView(
        () => ActionFeedback({ before: state, after: next, onContinue }),
        locale,
      );
      expect(feedback.html).toMatch(/[+−]/);
      if (event.id === 'letter') {
        expect(next.timeline.english).toEqual({ cefrLevel: 'B2' });
        expect(feedback.html).toContain(t('game.timelineChanged', locale));
      } else
        expect(feedback.html).not.toContain(t('game.timelineChanged', locale));
      feedback.click(t('game.continuePlaying', locale));
      expect(onContinue).toHaveBeenCalledOnce();
      if (locale === 'en') {
        expect(eventView.html).not.toMatch(cjk);
        expect(feedback.html).not.toMatch(cjk);
      }
      state = core.endQuarter(next);
    }
  },
);

test.each(['zh-CN', 'en'] as const)(
  'progress bars and details expose both outcomes and a walk-to-town-hall action in %s',
  (locale) => {
    const state = initial(locale);
    const onOpen = vi.fn();
    const view = renderView(() => ProgressBars({ state, onOpen }), locale);
    expect(view.html.match(/role="progressbar"/g)).toHaveLength(2);
    for (const [{ id }, index] of displayedRuleSets.map(
      (item, index) => [item, index] as const,
    )) {
      const bar = core.progress(state)[id];
      expect(view.html).toContain(`aria-valuenow="${bar.percent}"`);
      expect(view.html).toContain(t(`outcome.${bar.outcome}`, locale));
      view.click(t(index === 0 ? 'game.currentLaw' : 'game.reform', locale));
      expect(onOpen).toHaveBeenLastCalledWith(id);
      const onVisit = vi.fn();
      const detail = renderView(
        () => ProgressDetail({ state, id, onVisit }),
        locale,
      );
      const assessment = state.result.byRuleSet[id]!;
      expect(detail.html).toContain(t(`outcome.${assessment.outcome}`, locale));
      if (assessment.earliestDate)
        expect(detail.html).toContain(assessment.earliestDate);
      if (assessment.pathwayYears !== undefined)
        expect(detail.html).toContain(
          `${assessment.pathwayYears} ${t('result.years', locale)}`,
        );
      detail.click(t('game.councilDetails', locale));
      expect(onVisit).toHaveBeenCalledOnce();
      if (locale === 'en') expect(detail.html).not.toMatch(cjk);
    }
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'quarter summary shows actual income, expenses, stat and progress changes, countdown and event review in %s',
  (locale) => {
    const pending = core.act(initial(locale), 'work');
    const before = core.resolve(
      pending,
      core.currentEvent(pending)!.choices[0].id,
    );
    const after = core.endQuarter(before);
    const onContinue = vi.fn();
    const view = renderView(
      () => QuarterSummary({ before, after, onContinue }),
      locale,
    );
    expect(after.quarter).toBe(2);
    expect(view.html).toContain('£9,500');
    expect(view.html).toContain('£9,000');
    expect(view.html).toContain('+£500');
    expect(view.html).toContain('−3');
    expect(view.html).toContain(
      t('game.visa', locale).replace(
        '{count}',
        String(core.visaMonthsLeft(after)),
      ),
    );
    expect(view.html).toContain(before.log.at(-1)!.text[language(locale)]);
    for (const { id } of displayedRuleSets)
      expect(view.html).toContain(
        `${core.progress(before)[id].percent}% → ${core.progress(after)[id].percent}%`,
      );
    expect(core.progress(after)).not.toEqual(core.progress(before));
    view.click(t('game.nextQuarter', locale));
    expect(onContinue).toHaveBeenCalledOnce();
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'ending preserves narrative, achievements, final assessments and simulator timeline in %s',
  (locale) => {
    const state = finishGame(locale);
    const onChange = vi.fn<(next: GameState | undefined) => void>();
    const view = renderView(() => Ending({ state, onChange }), locale);
    for (const line of core.narrative(state))
      expect(view.html).toContain(
        renderToStaticMarkup(<>{line[language(locale)]}</>),
      );
    for (const achievement of core.achievements.filter((item) =>
      state.achievements.includes(item.id),
    ))
      expect(view.html).toContain(achievement.title[language(locale)]);
    for (const { id } of displayedRuleSets)
      expect(view.html).toContain(
        t(`outcome.${state.result.byRuleSet[id]!.outcome}`, locale),
      );
    const href = view.html.match(/href="(\/result#s=[^"]+)"/)![1];
    const draft = decodeDraft(
      new URLSearchParams(href.split('#')[1]).get('s')!,
    )!;
    expect(draft.timeline).toEqual(state.timeline);
    expect(draft.simulationDate).toBe(state.date);
    expect(draft.completed).toBe(true);
    expect(runSimulation(draft, locale).byRuleSet).toEqual(
      state.result.byRuleSet,
    );
    vi.spyOn(Date, 'now').mockReturnValue(2 ** 31 + 42);
    view.click(t('game.replay', locale));
    expect(onChange).toHaveBeenLastCalledWith(
      core.newGame(state.characterId, 42, locale),
    );
    view.click(t('game.changeCharacter', locale));
    expect(onChange).toHaveBeenLastCalledWith(undefined);
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
  },
);

test('per-character saves round trip independently and only v2 keys are read', () => {
  const first = core.act(initial(), 'work');
  core.characters.push({
    ...originalCharacters[0],
    id: 'second',
    name: { zhCN: '第二位', en: 'Second' },
  });
  const second = core.endQuarter(core.newGame('second', 42, 'en'));
  expect(gameStorage(first.characterId)).toEqual({
    state: undefined,
    available: true,
  });
  gameStorage(first.characterId, first);
  gameStorage(second.characterId, second);
  expect(JSON.parse(storage.get(keyFor(first.characterId))!)).toEqual(first);
  expect(gameStorage(first.characterId).state).toEqual(first);
  expect(gameStorage(second.characterId).state).toEqual(second);
  expect(core.currentEvent(gameStorage(first.characterId).state!)?.id).toBe(
    first.pendingEvent,
  );
  expect(
    getItem.mock.calls.every(([key]) =>
      key.startsWith('uk-immigration-life-v2:'),
    ),
  ).toBe(true);
});

test('malformed or unavailable storage does not block a new playable state', () => {
  const state = initial();
  const invalid = [
    '{broken',
    'null',
    '{}',
    JSON.stringify({ ...state, version: 1 }),
    JSON.stringify({ ...state, stats: {} }),
    JSON.stringify({ ...state, quarter: 5 }),
    JSON.stringify({ ...state, log: [null] }),
    JSON.stringify({ ...state, pendingEvent: 'missing' }),
    JSON.stringify({ ...state, timeline: {} }),
  ];
  for (const saved of invalid) {
    storage.set(keyFor(state.characterId), saved);
    expect(gameStorage(state.characterId)).toEqual({
      state: undefined,
      available: false,
    });
  }
  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw new Error('Unavailable');
    },
    setItem: () => {
      throw new Error('Quota exceeded');
    },
  });
  expect(gameStorage(state.characterId).available).toBe(false);
  expect(gameStorage(state.characterId, state)).toEqual({
    state,
    available: false,
  });
  expect(core.act(state, 'rest').stats.health).toBeGreaterThan(
    state.stats.health,
  );
});

test('locale switching only changes locale and engine text, preserving history and timeline', () => {
  const state = core.act(initial(), 'work');
  const snapshot = structuredClone(state);
  const translated = withGameLocale(state, 'en');
  expect(translated).toEqual({
    ...state,
    locale: 'en',
    result: evaluate({
      timeline: state.timeline,
      simulationDate: state.date,
      locale: 'en',
    }),
  });
  expect(translated.timeline).toBe(state.timeline);
  expect(translated.log).toBe(state.log);
  expect(translated.stats).toBe(state.stats);
  expect(translated.seed).toBe(state.seed);
  expect(state).toEqual(snapshot);
  expect(withGameLocale(translated, 'en')).toBe(translated);
});

function clientHarness(start?: GameState) {
  // Run the controller's effects explicitly while leaving child effects unmounted.
  const values: unknown[] = [
    start,
    {},
    true,
    true,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const setters = values.map((_, index) => (next: unknown) => {
    values[index] = typeof next === 'function' ? next(values[index]) : next;
  });
  const state = vi.spyOn(React, 'useState');
  let effects: React.EffectCallback[] = [];
  vi.spyOn(React, 'useEffect').mockImplementation((effect) => {
    effects.push(effect);
  });
  return {
    values,
    render(locale: Locale = 'zh-CN') {
      effects = [];
      for (let index = 0; index < values.length; index++)
        state.mockReturnValueOnce([values[index], setters[index]]);
      const view = renderView(() => GameClient(), locale);
      return { ...view, effects: effects.slice(0, 4) };
    },
  };
}

test('zero action points wait for event resolution and feedback before one automatic quarter settlement', () => {
  const pending = core.act({ ...initial(), actionsLeft: 1 }, 'work');
  expect(pending.actionsLeft).toBe(0);
  expect(core.currentEvent(pending)).toBeDefined();
  const client = clientHarness(pending);
  const first = client.render();
  first.effects[3]();
  expect(client.values[0]).toBe(pending);
  expect(client.values[7]).toBeUndefined();
  const eventProps = first.props(EventCard);
  renderView(() => EventCard(eventProps)).click(
    core.currentEvent(pending)!.choices[0].label.zhCN,
  );
  const resolved = client.values[0] as GameState;
  expect(resolved.pendingEvent).toBeUndefined();
  expect(resolved.actionsLeft).toBe(0);
  const feedback = client.render();
  feedback.effects[3]();
  expect(client.values[0]).toBe(resolved);
  expect(client.values[7]).toBeUndefined();
  feedback.props(ActionFeedback).onContinue();
  client.render().effects[3]();
  const settled = client.values[0] as GameState;
  expect(settled).toEqual(core.endQuarter(resolved));
  const summary = client.render();
  summary.effects[3]();
  expect(client.values[0]).toBe(settled);
  summary.props(QuarterSummary).onContinue();
  client.render().effects[3]();
  expect(client.values[0]).toBe(settled);
  expect(settled.log.filter((entry) => entry.kind === 'quarter')).toHaveLength(
    2,
  );
});

test('controller restores continue choices, saves state and locale changes, and retains saves when changing character', () => {
  const saved = core.act(initial(), 'work');
  gameStorage(saved.characterId, saved);
  const client = clientHarness();
  client.values[2] = false;
  const first = client.render();
  expect(first.html).toContain(t('game.loading'));
  first.effects[0]();
  const selection = client.render();
  const props = selection.props(CharacterSelect);
  renderView(() => CharacterSelect(props)).click(t('game.continue'));
  expect(client.values[0]).toEqual(saved);
  client.render('en').effects[1]();
  const english = client.render('en');
  english.effects[2]();
  expect(english.html).not.toMatch(cjk);
  const translated = gameStorage(saved.characterId).state!;
  expect(translated.locale).toBe('en');
  expect(translated.timeline).toEqual(saved.timeline);
  expect(translated.pendingEvent).toBe(saved.pendingEvent);
  // Resolve the pending event and close its feedback before changing character.
  const eventProps = english.props(EventCard);
  eventProps.onChange(
    core.resolve(
      eventProps.state,
      core.currentEvent(eventProps.state)!.choices[0].id,
    ),
  );
  client.render('en').props(ActionFeedback).onContinue();
  const active = client.render('en');
  active.effects[2]();
  const beforeSwitch = gameStorage(saved.characterId).state!;
  active.click(t('game.changeCharacter', 'en'));
  expect(client.values[0]).toBeUndefined();
  expect(gameStorage(saved.characterId).state).toEqual(beforeSwitch);
  const reloaded = client.render('en');
  reloaded.effects[0]();
  expect(
    client.render('en').props(CharacterSelect).saves[saved.characterId],
  ).toEqual(beforeSwitch);
});

test('simulator draft derives screening from the final timeline', () => {
  const state = finishGame();
  state.timeline.criminalRecord = [{ date: state.date }];
  state.timeline.immigrationBreaches = [
    { type: 'ILLEGAL_ENTRY', date: state.date },
  ];
  state.timeline.governmentDebt = { outstanding: true };
  const draft = decodeDraft(encodeDraft(gameDraft(state)))!;
  expect(draft.timeline).toEqual(state.timeline);
  expect(draft.simulationDate).toBe(state.date);
  expect(draft.screening).toEqual({
    criminality: 'yes',
    breach: 'yes',
    debt: 'yes',
  });
});
