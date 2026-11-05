import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { evaluate, type Locale } from '@uk-immigration/engine';
import {
  advance,
  characters,
  changedRules,
  choose,
  currentCard,
  isOver,
  startGame,
  TURNS,
  type Card,
  type GameState,
} from '@uk-immigration/game';
import { GameView } from '../app/game/game-view';
import GamePage from '../app/game/page';
import {
  gameDraft,
  gameStorage,
  mostChangedRules,
  withGameLocale,
} from '../app/game/session';
import Home from '../app/home-content';
import { t } from '../i18n';
import { LocaleContext } from '../i18n/locale';
import { displayedRuleSets } from '../lib/policy';
import { runSimulation } from '../lib/questionnaire';
import { decodeDraft, encodeDraft } from '../lib/share';

const gameKey = 'uk-immigration-game-v1';
const storage = new Map<string, string>();
const originalCharacters = [...characters];
const cjk = /[\u3400-\u9fff]/;

vi.mock('react', { spy: true });

beforeEach(() => {
  storage.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
});

afterEach(() => {
  characters.splice(0, characters.length, ...originalCharacters);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function textContent(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((child) =>
      React.isValidElement<{ children?: React.ReactNode }>(child)
        ? textContent(child.props.children)
        : String(child),
    )
    .join('');
}

function renderGame(
  state?: GameState,
  locale: Locale = 'zh-CN',
  onChange = vi.fn<(next: GameState | undefined) => void>(),
) {
  const buttons: { label: string; click: () => void }[] = [];
  function capture(node: React.ReactNode) {
    React.Children.forEach(node, (child) => {
      if (
        !React.isValidElement<{
          children?: React.ReactNode;
          onClick?: () => void;
        }>(child)
      )
        return;
      if (child.type === 'button' && child.props.onClick)
        buttons.push({
          label: textContent(child.props.children),
          click: child.props.onClick,
        });
      capture(child.props.children);
    });
  }
  function Probe() {
    const view = GameView({ state, onChange });
    capture(view);
    return view;
  }
  const html = renderToStaticMarkup(
    <LocaleContext value={{ locale, setLocale: () => {} }}>
      <Probe />
    </LocaleContext>,
  );
  return {
    html,
    buttons,
    onChange,
    click(label: string) {
      const button = buttons.find((item) => item.label === label);
      expect(button, `Expected a button labelled ${label}`).toBeDefined();
      button!.click();
      return onChange.mock.lastCall?.[0];
    },
  };
}

function continuingChoice(state: GameState, card: Card) {
  return (
    card.choices.find((choice) => !isOver(choose(state, choice.id))) ??
    card.choices[0]
  );
}

function finishGame(locale: Locale = 'zh-CN') {
  let state = startGame(characters[0].id, 7, locale);
  for (let action = 0; action < TURNS * 3 && !isOver(state); action++) {
    const card = currentCard(state);
    state = card
      ? choose(state, continuingChoice(state, card).id)
      : advance(state);
  }
  expect(isOver(state)).toBe(true);
  return state;
}

test.each(['zh-CN', 'en'] as const)(
  'homepage and arbitrary character lists expose the game in %s',
  (locale) => {
    const home = renderToStaticMarkup(
      <LocaleContext value={{ locale, setLocale: () => {} }}>
        <Home />
      </LocaleContext>,
    );
    expect(home).toContain('href="/game"');
    expect(home).toContain('Immigration Life');
    for (const count of [1, 4]) {
      const fixtures = Array.from({ length: count }, (_, index) => ({
        ...originalCharacters[0],
        id: `character-${index}`,
        name: { zhCN: `角色 ${index}`, en: `Character ${index}` },
        intro: { zhCN: `角色简介 ${index}`, en: `Introduction ${index}` },
      }));
      characters.splice(0, characters.length, ...fixtures);
      const view = renderGame(undefined, locale);
      for (const character of fixtures) {
        const language = locale === 'en' ? 'en' : 'zhCN';
        expect(view.html).toContain(character.name[language]);
        expect(view.html).toContain(character.intro[language]);
      }
      expect(view.buttons).toHaveLength(count);
      if (locale === 'en') expect(view.html).not.toMatch(cjk);
    }
  },
);

test.each(['zh-CN', 'en'] as const)(
  'character selection, luck, choices, next year and the full ending run through component actions in %s',
  (locale) => {
    const language = locale === 'en' ? 'en' : 'zhCN';
    vi.spyOn(Date, 'now').mockReturnValue(2 ** 31 + 7);
    const selection = renderGame(undefined, locale);
    selection.buttons[0].click();
    let state = selection.onChange.mock.lastCall![0]!;
    expect(state).toEqual(startGame(characters[0].id, 7, locale));
    expect(currentCard(state)?.kind).toBe('luck');
    expect(renderGame(state, locale).html).toContain(
      t('game.noChanges', locale),
    );
    let choices = 0;
    let luck = 0;
    let changed = 0;
    for (let action = 0; action < TURNS * 3 && !isOver(state); action++) {
      const view = renderGame(state, locale);
      expect(view.html).toContain(state.simulationDate);
      for (const ruleSet of displayedRuleSets) {
        const assessment = state.result.byRuleSet[ruleSet.id]!;
        expect(view.html).toContain(t(`policy.${ruleSet.kind}`, locale));
        expect(view.html).toContain(t(`outcome.${assessment.outcome}`, locale));
        if (assessment.pathwayYears !== undefined)
          expect(view.html).toContain(
            `${assessment.pathwayYears} ${t('result.years', locale)}`,
          );
        if (assessment.earliestDate)
          expect(view.html).toContain(`dateTime="${assessment.earliestDate}"`);
      }
      if (locale === 'en') expect(view.html).not.toMatch(cjk);
      const card = currentCard(state);
      if (!card) {
        const before = state;
        state = view.click(t('game.nextYear', locale))!;
        expect(state).toEqual(advance(before));
        expect(state.turn).toBe(before.turn + 1);
        continue;
      }
      expect(view.html).toContain(
        renderToStaticMarkup(<>{card.title[language]}</>),
      );
      expect(view.html).toContain(
        renderToStaticMarkup(<>{card.text[language]}</>),
      );
      const selected = continuingChoice(state, card);
      if (selected.note)
        expect(view.html).toContain(
          renderToStaticMarkup(<>{selected.note[language]}</>),
        );
      const before = state;
      state = view.click(
        card.kind === 'luck'
          ? t('game.acknowledge', locale)
          : selected.label[language],
      )!;
      expect(state).toEqual(choose(before, selected.id));
      const after = renderGame(state, locale);
      expect(after.html).toContain(t('game.changes', locale));
      for (const ruleSet of displayedRuleSets) {
        for (const change of changedRules(
          before.result,
          state.result,
          ruleSet.id,
        )) {
          changed++;
          const rule = state.result.byRuleSet[ruleSet.id]?.rules.find(
            (item) => item.id === change.id,
          );
          if (rule) {
            expect(after.html).toContain(
              renderToStaticMarkup(<>{rule.title}</>),
            );
            expect(after.html).toContain(
              renderToStaticMarkup(<>{rule.explanation}</>),
            );
            for (const source of rule.sources)
              expect(after.html).toContain(source.srcId);
          }
        }
      }
      if (card.kind === 'luck') {
        luck++;
        expect(currentCard(state)?.kind).toBe('choice');
      } else {
        choices++;
        expect(currentCard(state)).toBeUndefined();
      }
    }
    expect(choices).toBe(TURNS);
    expect(luck).toBeGreaterThan(0);
    expect(changed).toBeGreaterThan(0);
    expect(state.turn).toBe(TURNS);
    expect(isOver(state)).toBe(true);
    const ending = renderGame(state, locale);
    expect(ending.html).toContain(t('game.ending', locale));
    expect(ending.html).toContain(t('game.topRules', locale));
    expect(ending.buttons.map((button) => button.label)).toContain(
      t('game.replay', locale),
    );
    expect(ending.buttons.map((button) => button.label)).toContain(
      t('game.changeCharacter', locale),
    );
    const href = ending.html.match(/href="(\/result#s=[^"]+)"/)![1];
    const draft = decodeDraft(
      new URLSearchParams(href.split('#')[1]).get('s')!,
    )!;
    expect(draft.completed).toBe(true);
    expect(draft.timeline).toEqual(state.timeline);
    expect(draft.simulationDate).toBe(state.simulationDate);
    expect(runSimulation(draft, locale).byRuleSet).toEqual(
      state.result.byRuleSet,
    );
    if (locale === 'en') expect(ending.html).not.toMatch(cjk);
    vi.mocked(Date.now).mockReturnValue(2 ** 31 + 42);
    expect(ending.click(t('game.replay', locale))).toEqual(
      startGame(state.characterId, 42, locale),
    );
    expect(ending.click(t('game.changeCharacter', locale))).toBeUndefined();
    expect(ending.onChange).toHaveBeenLastCalledWith(undefined);
  },
);

test('storage round trips the full current state and clearing removes the save', () => {
  let state = startGame(characters[0].id, 7);
  const card = currentCard(state)!;
  state = choose(state, card.choices[0].id);
  expect(gameStorage()).toEqual({ state: undefined, available: true });
  expect(gameStorage(state).available).toBe(true);
  expect(JSON.parse(storage.get(gameKey)!)).toEqual(state);
  const restored = gameStorage().state!;
  expect(restored).toEqual(state);
  expect(renderGame(restored).html).toBe(renderGame(state).html);
  const choice = currentCard(restored)!.choices[0];
  const next = renderGame(restored).click(choice.label.zhCN)!;
  expect(next).toEqual(choose(state, choice.id));
  gameStorage(next);
  expect(gameStorage().state?.log).toEqual(next.log);
  expect(gameStorage(null)).toEqual({ state: undefined, available: true });
  expect(storage.has(gameKey)).toBe(false);
  expect(gameStorage().state).toBeUndefined();
});

test('the page restores a saved turn, persists a choice and locale switch, and clears on character change', () => {
  const initial = startGame(characters[0].id, 7);
  storage.set(gameKey, JSON.stringify(initial));
  let state: GameState | undefined;
  let ready = false;
  let available = true;
  let effects: React.EffectCallback[] = [];
  const focus = vi.fn();
  const scrollIntoView = vi.fn();
  const getElementById = vi.fn(() => ({ focus, scrollIntoView }));
  vi.stubGlobal('document', { getElementById });
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  const expectMovedTo = (id: string) => {
    expect(getElementById).toHaveBeenLastCalledWith(id);
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'start' });
  };
  const setState = vi.fn((next: unknown) => {
    state = next as GameState | undefined;
  });
  const setReady = vi.fn((next: unknown) => {
    ready = next as boolean;
  });
  const setAvailable = vi.fn((next: unknown) => {
    available = next as boolean;
  });
  const useState = vi.spyOn(React, 'useState');
  vi.spyOn(React, 'useEffect').mockImplementation((effect) => {
    effects.push(effect);
  });
  const renderPage = (locale: Locale = 'zh-CN') => {
    effects = [];
    let changeState: ((next: GameState | undefined) => void) | undefined;
    function capture(node: React.ReactNode) {
      React.Children.forEach(node, (child) => {
        if (
          !React.isValidElement<{
            children?: React.ReactNode;
            onChange?: (next: GameState | undefined) => void;
          }>(child)
        )
          return;
        if (child.type === GameView) changeState = child.props.onChange;
        capture(child.props.children);
      });
    }
    function Probe() {
      const page = GamePage();
      capture(page);
      return page;
    }
    useState
      .mockReturnValueOnce([state, setState])
      .mockReturnValueOnce([ready, setReady])
      .mockReturnValueOnce([available, setAvailable]);
    const html = renderToStaticMarkup(
      <LocaleContext value={{ locale, setLocale: () => {} }}>
        <Probe />
      </LocaleContext>,
    );
    return {
      html,
      effects: [...effects],
      onChange: vi.fn((next: GameState | undefined) => {
        expect(changeState).toBeDefined();
        changeState!(next);
      }),
    };
  };
  const first = renderPage();
  expect(first.html).toContain(t('result.loading'));
  first.effects.forEach((effect) => effect());
  expect(state).toEqual(initial);
  expect(JSON.parse(storage.get(gameKey)!)).toEqual(initial);
  const loaded = renderPage();
  expect(loaded.html).toContain(t('game.acknowledge'));
  renderGame(state, 'zh-CN', loaded.onChange).click(t('game.acknowledge'));
  expectMovedTo('game-step');
  const chosen = state!;
  renderPage().effects[2]();
  expect(JSON.parse(storage.get(gameKey)!)).toEqual(chosen);
  state = undefined;
  ready = false;
  renderPage().effects.forEach((effect) => effect());
  expect(state).toEqual(chosen);
  expect(renderPage().html).toContain(currentCard(chosen)!.title.zhCN);
  renderPage('en').effects[1]();
  const englishPage = renderPage('en');
  englishPage.effects[2]();
  expect(englishPage.html).not.toMatch(cjk);
  expect(JSON.parse(storage.get(gameKey)!).locale).toBe('en');
  const restoredState = state as GameState | undefined;
  expect(restoredState?.timeline).toEqual(chosen.timeline);
  expect(restoredState?.log).toEqual(chosen.log);
  const choice = currentCard(state!)!.choices[0];
  renderGame(state, 'en', englishPage.onChange).click(choice.label.en);
  expectMovedTo('game-results-heading');
  const resolvedPage = renderPage('en');
  resolvedPage.effects[2]();
  expect(JSON.parse(storage.get(gameKey)!)).toEqual(state);
  renderGame(state, 'en', resolvedPage.onChange).click(
    t('game.nextYear', 'en'),
  );
  expectMovedTo('game-step');
  renderGame(state, 'en', renderPage('en').onChange).click(
    t('game.changeCharacter', 'en'),
  );
  expectMovedTo('game-step');
  renderPage('en').effects[2]();
  expect(storage.has(gameKey)).toBe(false);
});

test('unavailable or malformed storage never prevents a new game from being played', () => {
  for (const saved of ['{broken', 'null', '{}']) {
    storage.set(gameKey, saved);
    expect(gameStorage()).toEqual({ state: undefined, available: false });
  }
  const state = startGame(characters[0].id, 7);
  storage.set(gameKey, JSON.stringify({ ...state, characterId: 'unknown' }));
  expect(gameStorage().state).toBeUndefined();
  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw new Error('Unavailable');
    },
    setItem: () => {
      throw new Error('Quota exceeded');
    },
    removeItem: () => {
      throw new Error('Unavailable');
    },
  });
  expect(gameStorage().available).toBe(false);
  expect(gameStorage(state)).toEqual({ state, available: false });
  expect(gameStorage(null).available).toBe(false);
  const view = renderGame(state);
  const next = view.click(t('game.acknowledge'))!;
  expect(next.log).toHaveLength(1);
  expect(currentCard(next)?.kind).toBe('choice');
});

test('locale switching changes card and rule text while retaining game logic and history', () => {
  let state = startGame(characters[0].id, 7);
  state = choose(state, currentCard(state)!.choices[0].id);
  const snapshot = structuredClone(state);
  const english = withGameLocale(state, 'en');
  expect(english).toEqual({
    ...snapshot,
    locale: 'en',
    result: evaluate({
      simulationDate: state.simulationDate,
      timeline: state.timeline,
      locale: 'en',
    }),
  });
  expect(english.timeline).toBe(state.timeline);
  expect(english.log).toBe(state.log);
  expect(state).toEqual(snapshot);
  const view = renderGame(state, 'en');
  expect(view.html).not.toMatch(cjk);
  expect(view.html).toContain(currentCard(english)!.title.en);
  const chosen = currentCard(english)!.choices[0];
  const next = view.click(chosen.label.en)!;
  expect(next.locale).toBe('en');
  expect(next.result).toEqual(choose(english, chosen.id).result);
  expect(renderGame(next, 'zh-CN').html).toMatch(cjk);
});

test('ending counts rule changes from every log entry and only returns the top three', () => {
  const state = finishGame();
  const counts = new Map<string, number>();
  for (const entry of state.log) {
    for (const { id } of displayedRuleSets) {
      const before = new Map(
        entry.before.byRuleSet[id]?.rules.map((rule) => [rule.id, rule.status]),
      );
      const after = new Map(
        entry.after.byRuleSet[id]?.rules.map((rule) => [rule.id, rule.status]),
      );
      for (const ruleId of new Set([...before.keys(), ...after.keys()])) {
        if (before.get(ruleId) !== after.get(ruleId)) {
          const key = `${id}:${ruleId}`;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
    }
  }
  const top = mostChangedRules(state);
  expect(top).toHaveLength(Math.min(3, counts.size));
  expect(new Set(top.map((item) => `${item.ruleSetId}:${item.id}`)).size).toBe(
    top.length,
  );
  expect(top.map((item) => item.count)).toEqual(
    [...counts.values()].sort((a, b) => b - a).slice(0, 3),
  );
  for (const item of top)
    expect(item.count).toBe(counts.get(`${item.ruleSetId}:${item.id}`));
  const english = renderGame(state, 'en');
  expect(english.html).not.toMatch(cjk);
});

test('rules removed from a column retain translated titles and sources after a language switch', () => {
  const state = startGame(characters[0].id, 7);
  const before = state.result;
  state.timeline.episodes = state.timeline.episodes.map((episode) => ({
    ...episode,
    route: 'HONG_KONG_BNO',
  }));
  state.result = evaluate({
    timeline: state.timeline,
    simulationDate: state.simulationDate,
    locale: state.locale,
  });
  state.phase = 'ended';
  state.log = [
    {
      turn: state.turn,
      cardId: characters[0].script[0].id,
      choiceId: characters[0].script[0].choices[0].id,
      before,
      after: state.result,
    },
  ];
  const removed = changedRules(
    before,
    state.result,
    displayedRuleSets[0].id,
  ).filter((change) => !change.after);
  expect(removed.length).toBeGreaterThan(0);
  const html = renderGame(state, 'en').html;
  expect(html).not.toMatch(cjk);
  expect(html).toContain(t('game.notAssessed', 'en'));
  expect(html).toContain(t('game.ruleAbsent', 'en'));
  for (const change of removed) {
    const oldRule = before.byRuleSet[displayedRuleSets[0].id]!.rules.find(
      (rule) => rule.id === change.id,
    )!;
    for (const source of oldRule.sources) expect(html).toContain(source.srcId);
  }
});

test('criminal and immigration screening are derived from the shared timeline', () => {
  const state = finishGame();
  state.timeline.criminalRecord = [{ date: state.simulationDate }];
  state.timeline.immigrationBreaches = [
    { type: 'ILLEGAL_ENTRY', date: state.simulationDate },
  ];
  state.timeline.governmentDebt = { outstanding: true };
  const draft = decodeDraft(encodeDraft(gameDraft(state)))!;
  expect(draft.timeline).toEqual(state.timeline);
  expect(draft.simulationDate).toBe(state.simulationDate);
  expect(draft.screening).toEqual({
    criminality: 'yes',
    breach: 'yes',
    debt: 'yes',
  });
  state.timeline.criminalRecord = [];
  state.timeline.immigrationBreaches = [];
  state.timeline.governmentDebt = { outstanding: false };
  expect(gameDraft(state).screening).toEqual({
    criminality: 'no',
    breach: 'no',
    debt: 'no',
  });
});

test('a criminal choice ends early with both short-circuit columns and working ending actions', () => {
  const character = characters.find((item) =>
    item.script.some((card) =>
      card.choices.some((choice) =>
        choice.effects.some((effect) => effect.type === 'criminal'),
      ),
    ),
  )!;
  let state = startGame(character.id, 7, 'en');
  let selectedCriminal = false;
  for (let action = 0; action < TURNS * 3 && !isOver(state); action++) {
    const card = currentCard(state);
    if (!card) {
      state = advance(state);
      continue;
    }
    const criminal = card.choices.find((choice) =>
      choice.effects.some((effect) => effect.type === 'criminal'),
    );
    if (criminal) {
      state = renderGame(state, 'en').click(criminal.label.en)!;
      selectedCriminal = true;
    } else {
      state = choose(state, continuingChoice(state, card).id);
    }
  }
  expect(selectedCriminal).toBe(true);
  expect(isOver(state)).toBe(true);
  expect(state.turn).toBeLessThan(TURNS);
  const html = renderGame(state, 'en').html;
  expect(html).toContain(t('game.ending', 'en'));
  expect(html).toContain(state.result.shortCircuit!.message);
  expect(html.match(/Requires regulated review/g)).toHaveLength(2);
  expect(html).not.toMatch(cjk);
});
