import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { evaluate, type Locale } from '@uk-immigration/engine';
import * as core from '@uk-immigration/game';
import type { GameState } from '@uk-immigration/game';
import GameClient from '../app/game/game-client';
import TownCanvas from '../app/game/town-canvas';
import {
  ActionFeedback,
  CharacterSelect,
  Ending,
  EventCard,
  LocationMenu,
  Modal,
  ProgressBars,
  ProgressDetail,
  QuarterSummary,
  StatusBar,
  money,
} from '../app/game/game-view';
import {
  gameDraft,
  gameStorage,
  needsVisaReminder,
  spritePath,
  statKeys,
  visaMonths,
  withGameLocale,
} from '../app/game/session';
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
  core.newGame(core.characters[0].id, 42, locale);
const escapeText = (text: string) => renderToStaticMarkup(<>{text}</>);

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
function resolveEvents(start: GameState): GameState {
  let state = start;
  for (let count = 0; core.currentEvent(state); count++) {
    expect(count).toBeLessThan(12);
    const event = core.currentEvent(state)!;
    const choice =
      event.choices.find((item) =>
        item.effects.every(
          (effect) => !['ending', 'criminal', 'breach'].includes(effect.type),
        ),
      ) ?? event.choices[0];
    state = core.resolve(state, choice.id);
  }
  expect(state.eventQueue).toEqual([]);
  return state;
}
const active = (locale: Locale = 'zh-CN') => resolveEvents(initial(locale));
function atDate(date: string, locale: Locale = 'zh-CN') {
  const state = active(locale);
  state.date = date;
  state.result = evaluate({
    timeline: state.timeline,
    simulationDate: date,
    locale,
  });
  return state;
}
function finishGame(locale: Locale = 'zh-CN') {
  const state = core.act(active(locale), 'leave');
  expect(core.isOver(state)).toBe(true);
  return state;
}

// These tests call overlay handlers, then compare their results with the real core.
test.each(['zh-CN', 'en'] as const)(
  'homepage and arbitrary character lists support start and per-character continue in %s',
  (locale) => {
    expect(renderView(() => <Home />, locale).html).toContain('href="/game"');
    vi.spyOn(Date, 'now').mockReturnValue(2 ** 31 + 42);
    for (const count of [1, 4]) {
      const characters = Array.from({ length: count }, (_, index) => ({
        ...originalCharacters[0],
        id: `character-${index}`,
        name: { zhCN: `角色 ${index}`, en: `Character ${index}` },
        intro: { zhCN: `简介 ${index}`, en: `Introduction ${index}` },
      }));
      core.characters.splice(0, core.characters.length, ...characters);
      const saved = core.act(active(), 'work');
      const onChange = vi.fn<(state: GameState) => void>();
      const view = renderView(
        () =>
          CharacterSelect({ saves: { [saved.characterId]: saved }, onChange }),
        locale,
      );
      expect(view.buttons).toHaveLength(count + 1);
      for (const character of characters) {
        expect(view.html).toContain(character.name[language(locale)]);
        expect(view.html).toContain(character.intro[language(locale)]);
        expect(view.html).toContain(spritePath(character.sprite));
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
  'HUD renders real stats, winter-first seasons, integer countdown and expiry warning in %s',
  (locale) => {
    const state = initial(locale);
    const before = renderView(() => StatusBar({ state }), locale).html;
    expect(before.match(/<meter /g)).toHaveLength(5);
    expect(before).toContain(money(state.stats.money));
    expect(before).toContain(state.date);
    expect(before).toContain(t('game.season1', locale));
    for (const stat of statKeys)
      expect(before).toContain(`aria-label="${t(`game.${stat}`, locale)}"`);
    expect(before).not.toContain(`title="${t('game.visaUrgent', locale)}"`);
    const urgent = atDate('2026-07-15', locale);
    urgent.quarter = 3;
    const after = renderView(() => StatusBar({ state: urgent }), locale).html;
    expect(core.visaMonthsLeft(urgent)).toBeLessThanOrEqual(6);
    expect(visaMonths(urgent)).toBe(Math.floor(core.visaMonthsLeft(urgent)));
    expect(after).toContain(`title="${t('game.visaUrgent', locale)}"`);
    expect(after).toContain(
      t('game.visa', locale).replace('{count}', String(visaMonths(urgent))),
    );
    expect(after).toContain(t('game.season3', locale));
    if (locale === 'en') expect(after).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'eight location overlays use real availability, AP costs, money effects and engine details in %s',
  (locale) => {
    const state = active(locale);
    for (const { id } of core.locations) {
      const onChange = vi.fn<(state: GameState) => void>();
      const view = renderView(
        () => LocationMenu({ state, location: id, onChange }),
        locale,
      );
      const actions = core
        .actions(state)
        .filter((action) => action.location === id);
      expect(view.buttons).toHaveLength(id === 'council' ? 0 : actions.length);
      if (id === 'council') {
        expect(core.act(state, 'assessment')).toBe(state);
        expect(view.html).toContain(t('result.why', locale));
        for (const { id: ruleSet } of displayedRuleSets) {
          const assessment = state.result.byRuleSet[ruleSet]!;
          expect(view.html).toContain(
            t(`outcome.${assessment.outcome}`, locale),
          );
          for (const rule of assessment.rules) {
            expect(view.html).toContain(escapeText(rule.explanation));
            for (const source of rule.sources)
              expect(view.html).toContain(source.srcId);
          }
        }
      } else
        for (const action of actions) {
          expect(view.html).toContain(
            escapeText(action.label[language(locale)]),
          );
          expect(view.html).toContain(
            t('game.actionCost', locale).replace(
              '{count}',
              String(action.cost ?? 1),
            ),
          );
          view.click(action.label[language(locale)]);
          const next = onChange.mock.lastCall![0];
          expect(next).toEqual(core.act(state, action.id));
          expect(next.actionsLeft).toBe(
            core.isOver(next) ? 0 : state.actionsLeft - (action.cost ?? 1),
          );
        }
      if (id === 'station')
        expect(view.html).toContain(t('game.travelRecall', locale));
      if (locale === 'en') expect(view.html).not.toMatch(cjk);
    }
    const work = core.act(state, 'work');
    expect(work.stats.money).toBeGreaterThan(state.stats.money);
    expect(work.stats.career).toBeGreaterThan(state.stats.career);
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
  'initial event choices preserve the queue and show real notes and changes in %s',
  (locale) => {
    const state = initial(locale);
    const event = core.currentEvent(state)!;
    expect(event).toBeDefined();
    expect(() => core.endQuarter(state)).toThrow();
    expect(
      core.actions(state).filter((action) => action.id !== 'assessment'),
    ).toEqual([]);
    const onChange = vi.fn<(state: GameState) => void>();
    const view = renderView(() => EventCard({ state, onChange }), locale);
    expect(view.buttons).toHaveLength(event.choices.length);
    expect(view.html).toContain(escapeText(event.text[language(locale)]));
    for (const choice of event.choices) {
      if (choice.note)
        expect(view.html).toContain(escapeText(choice.note[language(locale)]));
      view.click(choice.label[language(locale)]);
      const next = onChange.mock.lastCall![0];
      expect(next).toEqual(core.resolve(state, choice.id));
      expect(
        next.log.some(
          (entry) => entry.id === event.id && entry.choiceId === choice.id,
        ),
      ).toBe(true);
      const onContinue = vi.fn();
      const feedback = renderView(
        () => ActionFeedback({ before: state, after: next, onContinue }),
        locale,
      );
      for (const key of statKeys.filter(
        (key) => next.stats[key] !== state.stats[key],
      ))
        expect(feedback.html).toContain(t(`game.${key}`, locale));
      expect(feedback.html.includes(t('game.timelineChanged', locale))).toBe(
        JSON.stringify(next.timeline) !== JSON.stringify(state.timeline),
      );
      feedback.click(t('game.continuePlaying', locale));
      expect(onContinue).toHaveBeenCalledOnce();
      if (locale === 'en') expect(feedback.html).not.toMatch(cjk);
    }
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'progress overlays round real percentages and link to town hall in %s',
  (locale) => {
    const state = initial(locale);
    const onOpen = vi.fn();
    const view = renderView(() => ProgressBars({ state, onOpen }), locale);
    expect(view.html.match(/role="progressbar"/g)).toHaveLength(2);
    for (const [{ id }, index] of displayedRuleSets.map(
      (item, index) => [item, index] as const,
    )) {
      const bar = core.progress(state)[id];
      expect(view.html).toContain(`aria-valuenow="${Math.round(bar.percent)}"`);
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
      detail.click(t('game.councilDetails', locale));
      expect(onVisit).toHaveBeenCalledOnce();
      if (locale === 'en') expect(detail.html).not.toMatch(cjk);
    }
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
  },
);

test.each(['zh-CN', 'en'] as const)(
  'quarter and year-end summaries show actual net settlement, moments and progress in %s',
  (locale) => {
    let before = core.act(active(locale), 'work');
    for (let quarter = 1; quarter <= 4; quarter++) {
      before = resolveEvents(before);
      const after = core.endQuarter(before);
      const onContinue = vi.fn(),
        onVisit = vi.fn();
      const view = renderView(
        () => QuarterSummary({ before, after, onContinue, onVisit }),
        locale,
      );
      const entry = after.log.find(
        (item) =>
          item.kind === 'quarter' &&
          item.year === before.year &&
          item.quarter === before.quarter,
      )!;
      const net = entry.statDeltas!.money!;
      expect(view.html).toContain(t('game.netIncome', locale));
      expect(view.html).toContain(
        `${net > 0 ? '+' : net < 0 ? '−' : ''}${money(Math.abs(net))}`,
      );
      for (const moment of before.log.filter(
        (item) => item.year === before.year && item.quarter === before.quarter,
      ))
        expect(view.html).toContain(escapeText(moment.text[language(locale)]));
      expect(view.html).toContain(
        t('game.visa', locale).replace('{count}', String(visaMonths(after))),
      );
      if (quarter === 4) {
        expect(after.year).toBe(before.year + 1);
        expect(after.quarter).toBe(1);
        expect(view.html).toContain(t('game.yearSummary', locale));
        expect(view.html.match(/role="progressbar"/g)).toHaveLength(2);
        for (const { id } of displayedRuleSets)
          expect(view.html).toContain(
            `${Math.round(core.progress(before)[id].percent)}% → ${Math.round(core.progress(after)[id].percent)}%`,
          );
        view.click(t('game.councilDetails', locale));
        expect(onVisit).toHaveBeenCalledOnce();
      } else expect(view.html).not.toContain(t('game.yearSummary', locale));
      view.click(t('game.nextQuarter', locale));
      expect(onContinue).toHaveBeenCalledOnce();
      if (locale === 'en') expect(view.html).not.toMatch(cjk);
      before = after;
    }
  },
);

test.each(['zh-CN', 'en'] as const)(
  'renewal is first, charges the exported action fee and suppresses only this expiry reminder in %s',
  (locale) => {
    const before = atDate('2026-10-15', locale);
    expect(needsVisaReminder(before)).toBe(true);
    const action = core.actions(before).find((item) => item.id === 'extend')!;
    expect(action).toBeDefined();
    const fee = -action.effects.reduce(
      (sum, effect) => sum + (effect.type === 'money' ? effect.delta : 0),
      0,
    );
    const onChange = vi.fn<(state: GameState) => void>();
    const view = renderView(
      () => LocationMenu({ state: before, location: 'visa', onChange }),
      locale,
    );
    expect(view.buttons[0].label).toContain(action.label[language(locale)]);
    expect(view.html).toContain(money(fee));
    view.click(action.label[language(locale)]);
    const after = onChange.mock.lastCall![0];
    expect(after.stats.money).toBe(before.stats.money - fee);
    expect(after.actionsLeft).toBe(before.actionsLeft - (action.cost ?? 1));
    expect(
      after.timeline.episodes.slice(0, before.timeline.episodes.length),
    ).toEqual(before.timeline.episodes);
    expect(after.timeline.episodes).toHaveLength(
      before.timeline.episodes.length + 1,
    );
    expect(needsVisaReminder(after)).toBe(false);
    expect(core.actions(after).some((item) => item.id === 'extend')).toBe(
      false,
    );
    expect(needsVisaReminder({ ...after, date: '2029-10-15' })).toBe(true);
    const gap = structuredClone(after);
    gap.timeline.episodes.at(-1)!.validFrom = '2027-01-16';
    expect(needsVisaReminder(gap)).toBe(true);
    expect(
      needsVisaReminder({
        ...before,
        pendingEvent: initial(locale).pendingEvent,
        actionsLeft: 0,
        stats: { ...before.stats, money: 0 },
      }),
    ).toBe(true);
    const unavailable = structuredClone(before);
    unavailable.timeline.episodes[0].immigrationSalaryList = true;
    expect(
      renderView(
        () => LocationMenu({ state: unavailable, location: 'visa', onChange }),
        locale,
      ).html,
    ).not.toContain(`<strong>${action.label[language(locale)]}</strong>`);
    if (locale === 'en') expect(view.html).not.toMatch(cjk);
  },
);

test('six-month return records past absence and visibly reduces progress without moving the date', () => {
  const before = active();
  const onChange = vi.fn<(state: GameState) => void>();
  const action = core.actions(before).find((item) => item.id === 'travel-6')!;
  renderView(() =>
    LocationMenu({ state: before, location: 'station', onChange }),
  ).click(action.label.zhCN);
  const after = onChange.mock.lastCall![0];
  expect(after.date).toBe(before.date);
  expect(after.timeline.absences.length).toBe(
    before.timeline.absences.length + 1,
  );
  expect(after.timeline.absences.at(-1)!.to).toBe('2025-01-14');
  const law = 'current-law-2026-11';
  expect(core.progress(after)[law].percent).toBeLessThan(
    core.progress(before)[law].percent,
  );
  const rendered = renderView(() =>
    ProgressBars({ state: after, onOpen: vi.fn() }),
  ).html;
  expect(rendered).toContain(
    `aria-valuenow="${Math.round(core.progress(after)[law].percent)}"`,
  );
  expect(
    renderView(() => ActionFeedback({ before, after, onContinue: vi.fn() }))
      .html,
  ).toContain(t('game.timelineChanged'));
});

test.each(['zh-CN', 'en'] as const)(
  'ending renders narrative, earned/unearned and character achievements, results and exact simulator timeline in %s',
  (locale) => {
    core.characters[0] = {
      ...core.characters[0],
      achievements: [
        {
          id: 'personal-earned',
          name: { zhCN: '自有纪念', en: 'Personal keepsake' },
          description: { zhCN: '留下故事。', en: 'Leave a story.' },
          check: () => true,
        },
        {
          id: 'personal-unearned',
          name: { zhCN: '未来纪念', en: 'Future keepsake' },
          description: { zhCN: '下一段故事。', en: 'Another story.' },
          check: () => false,
        },
      ],
    };
    const state = finishGame(locale);
    const onChange = vi.fn<(next: GameState | undefined) => void>();
    const view = renderView(() => Ending({ state, onChange }), locale);
    for (const line of core.narrative(state))
      expect(view.html).toContain(escapeText(line[language(locale)]));
    const earned = view.html
      .split(`<h3>${t('game.earned', locale)}</h3>`)[1]
      .split('</section>')[0];
    const unearned = view.html
      .split(`<h3>${t('game.unearned', locale)}</h3>`)[1]
      .split('</section>')[0];
    for (const achievement of [
      ...core.achievements,
      ...core.characters[0].achievements!,
    ]) {
      expect(
        state.achievements.includes(achievement.id) ? earned : unearned,
      ).toContain(escapeText(achievement.name[language(locale)]));
      expect(
        state.achievements.includes(achievement.id) ? unearned : earned,
      ).not.toContain(escapeText(achievement.name[language(locale)]));
    }
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

test('per-character saves preserve public events, queue and random cursor through continued play', () => {
  const first = initial();
  expect(first.eventQueue.length).toBeGreaterThan(0);
  expect(gameStorage(first.characterId)).toEqual({
    state: undefined,
    available: true,
  });
  const publicEventState = core.newGame(core.characters[0].id, 7);
  expect(
    originalCharacters[0].events.some(
      (event) => event.id === publicEventState.pendingEvent,
    ),
  ).toBe(false);
  gameStorage(publicEventState.characterId, publicEventState);
  expect(gameStorage(publicEventState.characterId).state).toEqual(
    publicEventState,
  );
  core.characters.push({
    ...originalCharacters[0],
    id: 'second',
    name: { zhCN: '第二位', en: 'Second' },
  });
  const second = core.newGame('second', 7, 'en');
  gameStorage(first.characterId, first);
  gameStorage(second.characterId, second);
  const restored = gameStorage(first.characterId).state!;
  expect(restored).toEqual(first);
  expect(gameStorage(second.characterId).state).toEqual(second);
  expect(restored.randomState).toBe(first.randomState);
  expect(restored.eventQueue).toEqual(first.eventQueue);
  expect(core.endQuarter(resolveEvents(restored))).toEqual(
    core.endQuarter(resolveEvents(first)),
  );
  const systemStart = active();
  const system = core.act(
    { ...systemStart, stats: { ...systemStart.stats, english: 0 } },
    'exam',
  );
  expect(core.currentEvent(system)!.id).toBe('system-exam-failed');
  gameStorage(system.characterId, system);
  expect(gameStorage(system.characterId).state).toEqual(system);
  expect(
    getItem.mock.calls.every(([key]) =>
      key.startsWith('uk-immigration-life-v2:'),
    ),
  ).toBe(true);
});

test('invalid saves including old mock saves are rejected and unavailable storage does not stop play', () => {
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
    JSON.stringify({ ...state, eventQueue: ['missing'] }),
    JSON.stringify({ ...state, eventQueue: undefined, randomState: undefined }),
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
  const playable = active();
  expect(core.act(playable, 'rest').stats.health).toBeGreaterThan(
    playable.stats.health,
  );
});

test('locale switching only replaces locale and engine text while preserving the random stream and history', () => {
  const state = initial();
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
  expect(translated.eventQueue).toBe(state.eventQueue);
  expect(translated.randomState).toBe(state.randomState);
  expect(state).toEqual(snapshot);
  expect(withGameLocale(translated, 'en')).toBe(translated);
});

function clientHarness(start?: GameState) {
  // Drive the controller's effects; Phaser needs separate browser verification.
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
    true,
    undefined,
    false,
    false,
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

test('zero AP waits for two queued system events and both feedback cards before settling exactly once', () => {
  const base = active();
  const pending = core.act(
    { ...base, actionsLeft: 1, stats: { ...base.stats, mood: 1, health: 1 } },
    'overtime',
  );
  expect(pending.actionsLeft).toBe(0);
  expect(core.currentEvent(pending)!.id).toBe('system-homesick');
  expect(pending.eventQueue).toContain('system-hospital');
  const client = clientHarness(pending);
  for (const choiceId of ['stay', 'recover']) {
    const beforeEvent = client.values[0];
    const first = client.render();
    first.effects[3]();
    expect(client.values[7]).toBeUndefined();
    expect(client.values[0]).toBe(beforeEvent);
    expect(
      first.buttons.find((button) => button.label === t('game.endQuarter'))
        ?.disabled,
    ).toBe(true);
    const props = first.props(EventCard);
    renderView(() => EventCard(props)).click(
      core
        .currentEvent(props.state)!
        .choices.find((choice) => choice.id === choiceId)!.label.zhCN,
    );
    const resolved = client.values[0] as GameState;
    const feedback = client.render();
    feedback.effects[3]();
    expect(client.values[0]).toBe(resolved);
    expect(client.values[7]).toBeUndefined();
    feedback.props(ActionFeedback).onContinue();
  }
  const resolved = client.values[0] as GameState;
  expect(resolved.pendingEvent).toBeUndefined();
  expect(resolved.eventQueue).toEqual([]);
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
    1,
  );
});

test('controller waits for scene ready, restores a save, persists language and retains it on character change', () => {
  const saved = initial();
  gameStorage(saved.characterId, saved);
  const client = clientHarness();
  client.values[2] = false;
  expect(client.render().html).toContain(t('game.loading'));
  client.render().effects[0]();
  const selection = client.render().props(CharacterSelect);
  renderView(() => CharacterSelect(selection)).click(t('game.continue'));
  expect(client.values[0]).toEqual(saved);
  const loading = client.render();
  expect(loading.html).toContain(t('game.loading'));
  expect(
    loading.buttons.find((button) => button.label === t('game.endQuarter'))
      ?.disabled,
  ).toBe(true);
  loading.props(TownCanvas).onReady();
  client.render('en').effects[1]();
  const english = client.render('en');
  english.effects[2]();
  expect(english.html).not.toMatch(cjk);
  expect(gameStorage(saved.characterId).state!.locale).toBe('en');
  while (core.currentEvent(client.values[0] as GameState)) {
    const eventProps = client.render('en').props(EventCard);
    const event = core.currentEvent(eventProps.state)!;
    eventProps.onChange(core.resolve(eventProps.state, event.choices[0].id));
    client.render('en').props(ActionFeedback).onContinue();
  }
  const current = client.render('en');
  current.effects[2]();
  const stored = gameStorage(saved.characterId).state!;
  current.click(t('game.changeCharacter', 'en'));
  expect(client.values[0]).toBeUndefined();
  expect(gameStorage(saved.characterId).state).toEqual(stored);
  client.render('en').effects[0]();
  expect(
    client.render('en').props(CharacterSelect).saves[saved.characterId],
  ).toEqual(stored);
});

test('quarter reminder can be acknowledged once, preserves pending events and reappears next quarter', () => {
  const state = atDate('2026-10-15');
  state.year = 2;
  state.quarter = 4;
  state.pendingEvent = initial().pendingEvent;
  const client = clientHarness(state);
  const first = client.render();
  expect(first.props(Modal).title).toBe(t('game.visaReminderTitle'));
  first.click(t('game.continuePlaying'));
  expect(client.render().props(EventCard).state.pendingEvent).toBe(
    state.pendingEvent,
  );
  client.values[0] = { ...state, year: 3, quarter: 1 };
  expect(client.render().props(Modal).title).toBe(t('game.visaReminderTitle'));
});

test.each(originalCharacters.map((character) => character.id))(
  'real character %s plays eight quarters through overlay callbacks with save restoration',
  (characterId) => {
    let state = core.newGame(characterId, 42, 'en');
    const handleEvents = () => {
      for (let count = 0; core.currentEvent(state); count++) {
        expect(count).toBeLessThan(12);
        const event = core.currentEvent(state)!;
        const choice =
          event.choices.find((item) =>
            item.effects.every(
              (effect) =>
                !['ending', 'criminal', 'breach'].includes(effect.type),
            ),
          ) ?? event.choices[0];
        const onChange = (next: GameState) => {
          state = next;
        };
        const eventView = renderView(
          () => EventCard({ state, onChange }),
          'en',
        );
        expect(eventView.html).not.toMatch(cjk);
        eventView.click(choice.label.en);
      }
      expect(state.eventQueue).toEqual([]);
    };
    for (let quarter = 0; quarter < 8; quarter++) {
      handleEvents();
      while (state.actionsLeft > 0) {
        const available = core.actions(state);
        const action =
          available.find((item) => item.id === 'extend') ??
          available.find((item) => item.id === 'work')!;
        const view = renderView(
          () =>
            LocationMenu({
              state,
              location: action.location,
              onChange: (next) => {
                state = next;
              },
            }),
          'en',
        );
        view.click(action.label.en);
        handleEvents();
        expect(core.isOver(state)).toBe(false);
      }
      const before = state;
      state = core.endQuarter(state);
      const summary = renderView(
        () =>
          QuarterSummary({
            before,
            after: state,
            onContinue: vi.fn(),
            onVisit: vi.fn(),
          }),
        'en',
      );
      expect(summary.html).not.toMatch(cjk);
      expect(core.isOver(state)).toBe(false);
      expect(
        state.log.filter((entry) => entry.kind === 'quarter'),
      ).toHaveLength(quarter + 1);
      gameStorage(state.characterId, state);
      const restored = gameStorage(state.characterId).state!;
      expect(restored).toEqual(state);
      state = restored;
    }
    expect(state.year).toBe(3);
    expect(state.quarter).toBe(1);
    expect(state.timeline.immigrationBreaches).toEqual([]);
  },
);

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
