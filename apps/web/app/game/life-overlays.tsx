'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/locale';
import {
  buy,
  cook,
  currentEvent,
  eat,
  festivals,
  fish,
  gift,
  harvest,
  hearts,
  items,
  mailbox,
  npcs,
  plant,
  readMail,
  recipes,
  resolve,
  shop,
  townsfolk,
  water,
  type GameState,
  type PlaceId,
  type Text,
} from './mock-core';
import { dayDate, localText, money, weatherIcon } from './game-view';
import { itemIcon, spritePath } from './session';
import { playSound } from './sound';
import styles from './game.module.css';
import site from '../site.module.css';
type Change = { state: GameState; onChange: (state: GameState) => void };
export function MorningCard({
  state,
  onContinue,
}: {
  state: GameState;
  onContinue: () => void;
}) {
  const { t, locale } = useTranslation();
  const festival = festivals.find((f) => f.id === state.day.festival);
  return (
    <div className={styles.morning}>
      <div className={styles.weatherIcon} aria-hidden="true">
        {weatherIcon[state.day.weather]}
      </div>
      <h3>
        {dayDate(state.day.date, locale)} · {t(`game.${state.day.kind}`)}
      </h3>
      <p>
        {t(`game.${state.day.weather}`)} · 07:00 ·{' '}
        {t('game.day').replace('{day}', String(state.day.index + 1))}
      </p>
      <p>
        {t('game.mailCount').replace('{count}', String(mailbox(state).length))}
      </p>
      <p>
        {festival ? localText(festival.name, locale) : t('game.noFestival')}
      </p>
      {festival && <p>{localText(festival.text, locale)}</p>}
      <button className={site.button} onClick={onContinue}>
        {t('game.beginDay')}
      </button>
    </div>
  );
}
export function ItemIcon({ id }: { id: string }) {
  return (
    <span
      aria-hidden="true"
      className={styles.itemIcon}
      style={{
        backgroundImage: `url("${itemIcon(id)}")`,
        backgroundPosition: itemIcon(id).includes('/crops/')
          ? '-160px 0'
          : '0 0',
        backgroundSize: itemIcon(id).includes('/crops/')
          ? '192px 32px'
          : '32px 32px',
      }}
    />
  );
}
export function ItemName({ id }: { id: string }) {
  const { locale, t } = useTranslation();
  const item = items.find((i) => i.id === id);
  return <>{item ? localText(item.name, locale) : t('game.itemFallback')}</>;
}
export function Dialogue({
  state,
  npc,
  onChange,
  onClose,
}: Change & { npc: string; onClose: () => void }) {
  const { t, locale } = useTranslation();
  const person = npcs.find((n) => n.id === npc)!;
  const event = currentEvent(state);
  const line = localText(
    event?.text ?? state.outcome?.text ?? person.lines[0].text,
    locale,
  );
  const [letters, setLetters] = useState(0);
  const [gifting, setGifting] = useState(false);
  useEffect(() => {
    setLetters(0);
    const timer = setInterval(
      () => setLetters((n) => Math.min(n + 1, line.length)),
      28,
    );
    return () => clearInterval(timer);
  }, [line]);
  useEffect(() => {
    if (letters && letters < line.length && letters % 3 === 0)
      playSound('voice', npc);
  }, [letters, line, npc]);
  return (
    <>
      <div className={styles.dialogueBody}>
        <span
          className={styles.portrait}
          style={{ backgroundImage: `url("${spritePath(npc)}")` }}
          aria-hidden="true"
        />
        <div>
          <strong>{localText(person.name, locale)}</strong>
          <small>
            {' '}
            {localText(person.role, locale)} · {'♥'.repeat(hearts(state, npc))}
            {'♡'.repeat(10 - hearts(state, npc))}
          </small>
          <p aria-live="polite" aria-label={line}>
            {line.slice(0, letters)}
            <span aria-hidden="true">{letters < line.length ? '▍' : ''}</span>
          </p>
        </div>
      </div>
      {letters < line.length && (
        <button
          className={styles.close}
          onClick={() => setLetters(line.length)}
        >
          {t('game.reveal')}
        </button>
      )}
      {event ? (
        <div className={styles.choices}>
          {event.choices.map((c) => (
            <button
              key={c.id}
              className={styles.choice}
              onClick={() => onChange(resolve(state, c.id))}
            >
              {localText(c.label, locale)}
              {c.note && <small>{localText(c.note, locale)}</small>}
            </button>
          ))}
        </div>
      ) : (
        <>
          {gifting ? (
            <div className={styles.itemGrid}>
              {Object.entries(state.inventory)
                .filter(([, n]) => n > 0)
                .map(([id, n]) => (
                  <button
                    key={id}
                    className={styles.choice}
                    onClick={() => {
                      onChange(gift(state, npc, id));
                      setGifting(false);
                    }}
                  >
                    <ItemIcon id={id} />
                    <span>
                      <ItemName id={id} /> × {n}
                    </span>
                  </button>
                ))}
            </div>
          ) : (
            <button
              className={site.secondary}
              disabled={state.day.gifted.includes(npc)}
              onClick={() => setGifting(true)}
            >
              {t(
                state.day.gifted.includes(npc) ? 'game.giftDone' : 'game.gift',
              )}
            </button>
          )}
          <button className={site.button} onClick={onClose}>
            {t('game.finishedTalking')}
          </button>
        </>
      )}
    </>
  );
}
export function Inventory({
  state,
  onChange,
  onKitchen,
}: Change & { onKitchen: () => void }) {
  const { t, locale } = useTranslation();
  const [tab, setTab] = useState<'bag' | 'friends'>('bag');
  const inventory = Object.entries(state.inventory).filter(([, n]) => n > 0);
  return (
    <>
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'bag'}
          onClick={() => setTab('bag')}
        >
          {t('game.bag')}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'friends'}
          onClick={() => setTab('friends')}
        >
          {t('game.friends')}
        </button>
      </div>
      {tab === 'friends' ? (
        <ul className={styles.friendList}>
          {townsfolk(state).map((n) => (
            <li key={n.id}>
              <span
                className={styles.smallPortrait}
                style={{ backgroundImage: `url("${spritePath(n.id)}")` }}
                aria-hidden="true"
              />
              <span>
                {localText(n.name, locale)}
                <small>{localText(n.role, locale)}</small>
              </span>
              <span aria-label={`${hearts(state, n.id)} / 10`}>
                {'♥'.repeat(hearts(state, n.id))}
                {'♡'.repeat(10 - hearts(state, n.id))}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {!inventory.length && <p>{t('game.emptyBag')}</p>}
          <div className={styles.itemGrid}>
            {inventory.map(([id, n]) => (
              <article className={styles.itemCard} key={id}>
                <ItemIcon id={id} />
                <strong>
                  <ItemName id={id} /> × {n}
                </strong>
                {items.find((i) => i.id === id)?.edible && (
                  <button
                    className={site.secondary}
                    onClick={() => onChange(eat(state, id))}
                  >
                    {t('game.eat')}
                  </button>
                )}
              </article>
            ))}
          </div>
          <p>{t('game.kitchenHint')}</p>
          <button className={site.secondary} onClick={onKitchen}>
            {t('game.cook')}
          </button>
        </>
      )}
    </>
  );
}
export function Kitchen({ state, onChange }: Change) {
  const { t, locale } = useTranslation();
  return (
    <div className={styles.choices}>
      {recipes.map((r) => (
        <button
          key={r.id}
          className={styles.choice}
          disabled={Object.entries(r.needs).some(
            ([id, n]) => (state.inventory[id] ?? 0) < n,
          )}
          onClick={() => onChange(cook(state, r.id))}
        >
          <strong>{localText(r.label, locale)}</strong>
          <span>
            {t('game.recipeNeeds')}:{' '}
            {Object.entries(r.needs).map(([id, n]) => (
              <span key={id}>
                <ItemName id={id} /> × {n}{' '}
              </span>
            ))}
          </span>
          <small>{r.minutes} min</small>
        </button>
      ))}
    </div>
  );
}
export function Shop({ state, place, onChange }: Change & { place: PlaceId }) {
  const { t, locale } = useTranslation();
  const [qty, setQty] = useState(1);
  return (
    <>
      <label className={styles.quantity}>
        {t('game.quantity')}
        <input
          aria-label={t('game.quantity')}
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) =>
            setQty(
              Math.max(
                1,
                Math.min(99, Math.floor(Number(e.target.value)) || 1),
              ),
            )
          }
        />
      </label>
      <div className={styles.itemGrid}>
        {shop(state, place).map((i) => (
          <article key={i.id} className={styles.itemCard}>
            <ItemIcon id={i.id} />
            <strong>{localText(i.name, locale)}</strong>
            <span>
              {money(i.price!)} × {qty}
            </span>
            <button
              className={site.secondary}
              disabled={state.stats.money < i.price! * qty}
              onClick={() => onChange(buy(state, i.id, qty))}
            >
              {t('game.buy')} · {money(i.price! * qty)}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
export function PlotMenu({ state, plot, onChange }: Change & { plot: number }) {
  const { t, locale } = useTranslation();
  const p = state.plots[plot];
  if (!p) return <p>{t('game.rentFirst')}</p>;
  const seed = items.find((i) => i.id === p.seed);
  const seeds = items.filter(
    (i) =>
      i.grows?.seasons.includes(state.quarter) &&
      (state.inventory[i.id] ?? 0) > 0,
  );
  return p.seed ? (
    <>
      <p>
        <ItemName id={seed?.grows?.crop ?? p.seed} /> ·{' '}
        {t('game.growth').replace('{count}', String(p.growth))}
      </p>
      <div className={styles.buttons}>
        <button
          className={site.secondary}
          disabled={p.wateredOn === state.dayNumber}
          onClick={() => onChange(water(state, plot))}
        >
          {t(p.wateredOn === state.dayNumber ? 'game.watered' : 'game.water')}
        </button>
        <button
          className={site.button}
          disabled={p.growth < (seed?.grows?.days ?? 4)}
          onClick={() => onChange(harvest(state, plot))}
        >
          {t('game.harvest')}
        </button>
      </div>
    </>
  ) : (
    <>
      <p>{t('game.plant')}</p>
      {!seeds.length && <p>{t('game.noSeeds')}</p>}
      <div className={styles.choices}>
        {seeds.map((i) => (
          <button
            key={i.id}
            className={styles.choice}
            onClick={() => onChange(plant(state, plot, i.id))}
          >
            {localText(i.name, locale)} × {state.inventory[i.id]}
          </button>
        ))}
      </div>
    </>
  );
}
export function Mailbox({ state, onChange }: Change) {
  const { t } = useTranslation();
  return (
    <>
      <p>
        {t('game.mailCount').replace('{count}', String(mailbox(state).length))}
      </p>
      {mailbox(state).length ? (
        <button
          className={site.button}
          onClick={() => onChange(readMail(state))}
        >
          {t('game.readMail')}
        </button>
      ) : (
        <p>{t('game.noMail')}</p>
      )}
    </>
  );
}
export function Fishing({ state, onChange }: Change) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<
    'idle' | 'waiting' | 'bite' | 'win' | 'miss'
  >('idle');
  const stage = useRef(phase);
  stage.current = phase;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const deadline = useRef(0);
  const latest = useRef({ state, onChange });
  latest.current = { state, onChange };
  const finish = (success: boolean) => {
    if (!['waiting', 'bite'].includes(stage.current)) return;
    stage.current = success ? 'win' : 'miss';
    clearTimeout(timer.current);
    setPhase(stage.current);
    latest.current.onChange(fish(latest.current.state, success));
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ([' ', 'e', 'E'].includes(e.key) && !e.repeat) {
        e.preventDefault();
        finish(stage.current === 'bite' && Date.now() <= deadline.current);
      }
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      clearTimeout(timer.current);
    };
  }, []);
  const cast = () => {
    stage.current = 'waiting';
    setPhase('waiting');
    timer.current = setTimeout(
      () => {
        stage.current = 'bite';
        setPhase('bite');
        deadline.current = Date.now() + 600;
        timer.current = setTimeout(() => finish(false), 600);
      },
      1000 + Math.random() * 3000,
    );
  };
  return (
    <div className={styles.fishing}>
      <p>{t('game.fishHint')}</p>
      <div
        className={`${styles.floatWater} ${phase === 'bite' ? styles.floatBite : ''}`}
        aria-hidden="true"
      >
        <span>●</span>
      </div>
      <p role="status">
        {t(
          phase === 'waiting'
            ? 'game.waitingFish'
            : phase === 'bite'
              ? 'game.bite'
              : phase === 'win'
                ? 'game.fishWin'
                : phase === 'miss'
                  ? 'game.fishMiss'
                  : 'game.fish',
        )}
      </p>
      {phase === 'waiting' || phase === 'bite' ? (
        <button
          className={site.button}
          onClick={() =>
            finish(stage.current === 'bite' && Date.now() <= deadline.current)
          }
        >
          {t('game.reel')}
        </button>
      ) : (
        <button className={site.button} onClick={cast}>
          {t('game.cast')}
        </button>
      )}
    </div>
  );
}
export function OutcomeText({ text }: { text?: Text }) {
  const { locale } = useTranslation();
  return text ? (
    <p role="status" className={styles.outcomeToast}>
      {localText(text, locale)}
    </p>
  ) : null;
}
