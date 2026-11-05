'use client';

import Link from 'next/link';
import {
  RULES,
  type RuleSetId,
  type SimulationResult,
} from '@uk-immigration/engine';
import {
  advance,
  changedRules,
  characters,
  choose,
  currentCard,
  isOver,
  publicLuck,
  startGame,
  TURNS,
  type GameState,
} from '@uk-immigration/game';
import { RuleSetStatus } from '../../components/policy-status';
import { jumpToAssessment } from '../../components/result-view';
import { useTranslation } from '../../i18n/locale';
import { displayedRuleSets } from '../../lib/policy';
import { encodeDraft } from '../../lib/share';
import { sourceUrls } from '../../lib/sources';
import { gameDraft, mostChangedRules, withGameLocale } from './session';
import site from '../site.module.css';
import resultStyles from '../result/result.module.css';
import styles from './game.module.css';

function GameColumns({
  state,
  before,
}: {
  state: GameState;
  before: SimulationResult;
}) {
  const { t, locale } = useTranslation();
  return (
    <section className={styles.results} aria-labelledby="game-results-heading">
      <h2
        id="game-results-heading"
        tabIndex={-1}
        className={styles.resultsHeading}
      >
        {t('game.results')}
      </h2>
      <nav
        className={resultStyles.columnNavigation}
        aria-label={t('result.navigation')}
      >
        {displayedRuleSets.map((ruleSet) => (
          <button
            key={ruleSet.id}
            type="button"
            onClick={() => jumpToAssessment(`game-${ruleSet.id}`)}
          >
            {t(`policy.${ruleSet.kind}`)}
          </button>
        ))}
      </nav>
      <div className={`${resultStyles.columns} ${styles.columns}`}>
        {displayedRuleSets.map((ruleSet) => {
          const assessment = state.result.byRuleSet[ruleSet.id];
          const changes = changedRules(before, state.result, ruleSet.id);
          return (
            <section
              key={ruleSet.id}
              className={`${resultStyles.assessment} ${ruleSet.kind === 'ANNOUNCED' ? resultStyles.announced : ''}`}
              aria-labelledby={`game-${ruleSet.id}`}
            >
              <h2
                id={`game-${ruleSet.id}`}
                className={resultStyles.heading}
                tabIndex={-1}
              >
                {t(`policy.${ruleSet.kind}`)}
              </h2>
              {displayedRuleSets
                .filter((other) => other.id !== ruleSet.id)
                .map((other) => (
                  <button
                    key={other.id}
                    type="button"
                    className={resultStyles.columnJump}
                    onClick={() => jumpToAssessment(`game-${other.id}`)}
                  >
                    {t('result.jumpTo').replace(
                      '{column}',
                      t(`policy.${other.kind}`),
                    )}
                  </button>
                ))}
              <span
                className={`${site.badge} ${ruleSet.kind === 'ANNOUNCED' ? site.announced : ''}`}
              >
                <RuleSetStatus ruleSet={ruleSet} />
              </span>
              {!assessment ? (
                <p>{t('result.missingAssessment')}</p>
              ) : (
                <>
                  <div
                    className={`${resultStyles.outcome} ${assessment.outcome === 'LIKELY_ELIGIBLE' ? resultStyles.success : assessment.outcome === 'LIKELY_NOT_ELIGIBLE' ? resultStyles.failure : resultStyles.unknown}`}
                  >
                    <h3>{t(`outcome.${assessment.outcome}`)}</h3>
                    <p>{t(`outcome.${assessment.outcome}.description`)}</p>
                  </div>
                  {assessment.outcome === 'REQUIRES_REGULATED_REVIEW' &&
                    state.result.shortCircuit && (
                      <p className={`${site.notice} ${site.warning}`}>
                        {state.result.shortCircuit.message}
                      </p>
                    )}
                  <dl className={resultStyles.facts}>
                    <div>
                      <dt>{t('result.pathway')}</dt>
                      <dd>
                        {assessment.pathwayYears === undefined
                          ? t('result.undetermined')
                          : `${assessment.pathwayYears} ${t('result.years')}`}
                      </dd>
                    </div>
                    <div>
                      <dt>{t('result.earliest')}</dt>
                      <dd>
                        {assessment.earliestDate ? (
                          <time dateTime={assessment.earliestDate}>
                            {assessment.earliestDate}
                          </time>
                        ) : (
                          t('result.undetermined')
                        )}
                      </dd>
                    </div>
                  </dl>
                </>
              )}
              <h3>{t('game.changes')}</h3>
              {!changes.length ? (
                <p className={site.muted}>{t('game.noChanges')}</p>
              ) : (
                <ul className={resultStyles.rules}>
                  {changes.map((change) => {
                    const rule = assessment?.rules.find(
                      (rule) => rule.id === change.id,
                    );
                    const meta = RULES[ruleSet.id].find(
                      (rule) => rule.meta.id === change.id,
                    )?.meta;
                    return (
                      <li
                        key={change.id}
                        className={`${resultStyles.rule} ${styles.change}`}
                        data-status={change.after}
                      >
                        <details>
                          <summary>
                            <strong>
                              {rule?.title ??
                                (locale === 'en'
                                  ? meta?.titleEn
                                  : meta?.title) ??
                                change.id}
                            </strong>
                            <span className={styles.transition}>
                              {change.before
                                ? t(`result.${change.before}`)
                                : t('game.notAssessed')}
                              {' → '}
                              {change.after
                                ? t(`result.${change.after}`)
                                : t('game.notAssessed')}
                            </span>
                          </summary>
                          <p>{rule?.explanation ?? t('game.ruleAbsent')}</p>
                          <p className={site.muted}>{t('result.sources')}</p>
                          <div className={resultStyles.sources}>
                            {(rule?.sources ?? meta?.sources ?? []).map(
                              (source, index) =>
                                sourceUrls[source.srcId] ? (
                                  <a
                                    key={index}
                                    href={sourceUrls[source.srcId]}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {source.srcId} {source.locator}
                                  </a>
                                ) : (
                                  <span key={index}>
                                    {source.srcId} {source.locator}
                                  </span>
                                ),
                            )}
                          </div>
                          {!!rule?.pendingDetails?.length && (
                            <p>
                              {t('result.pendingDetails')} ·{' '}
                              {rule.pendingDetails.join(', ')}
                            </p>
                          )}
                        </details>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

export function GameView({
  state,
  onChange,
}: {
  state?: GameState;
  onChange: (state: GameState | undefined) => void;
}) {
  const { t, locale } = useTranslation();
  const language = locale === 'en' ? 'en' : 'zhCN';
  const game = state && withGameLocale(state, locale);
  if (!game)
    return (
      <>
        <h1 id="game-step" tabIndex={-1}>
          Immigration Life
        </h1>
        <p className={`${site.lead} ${site.narrow}`}>{t('game.intro')}</p>
        <h2>{t('game.chooseCharacter')}</h2>
        <div className={styles.characters}>
          {characters.map((character) => (
            <article key={character.id} className={styles.character}>
              <h3>{character.name[language]}</h3>
              <p>{character.intro[language]}</p>
              <button
                type="button"
                className={site.button}
                onClick={() =>
                  onChange(
                    startGame(character.id, Date.now() % 2 ** 31, locale),
                  )
                }
              >
                {t('game.startAs').replace('{name}', character.name[language])}
              </button>
            </article>
          ))}
        </div>
      </>
    );

  const character = characters.find((item) => item.id === game.characterId)!;
  const over = isOver(game);
  const card = currentCard(game);
  const last = game.log.at(-1);
  const lastThisTurn = last?.turn === game.turn ? last : undefined;
  const resolvedCard =
    lastThisTurn &&
    [...character.script, ...character.luckPool, ...publicLuck].find(
      (item) => item.id === lastThisTurn.cardId,
    );
  const resolvedChoice = resolvedCard?.choices.find(
    (item) => item.id === lastThisTurn?.choiceId,
  );
  const before =
    (lastThisTurn ? lastThisTurn.before : last?.after) ?? game.result;
  const topRules = over ? mostChangedRules(game) : [];
  const ruleTitle = (id: string, ruleSetId: RuleSetId) => {
    const rule = game.result.byRuleSet[ruleSetId]?.rules.find(
      (rule) => rule.id === id,
    );
    const meta = RULES[ruleSetId].find((rule) => rule.meta.id === id)?.meta;
    return rule?.title ?? (locale === 'en' ? meta?.titleEn : meta?.title) ?? id;
  };
  return (
    <>
      <div className={styles.turnHeader}>
        <div>
          <h1>Immigration Life</h1>
          <p className={styles.characterName}>{character.name[language]}</p>
        </div>
        <div className={styles.turn}>
          <strong>
            {t('game.turn')
              .replace('{turn}', String(game.turn))
              .replace('{total}', String(TURNS))}
          </strong>
          <span>
            {t('game.date')}{' '}
            <time dateTime={game.simulationDate}>{game.simulationDate}</time>
          </span>
        </div>
      </div>
      <section
        className={`${styles.card} ${card?.kind === 'luck' ? styles.luck : ''}`}
        aria-labelledby="game-step"
      >
        {over ? (
          <>
            <h2 id="game-step" tabIndex={-1}>
              {t('game.ending')}
            </h2>
            <p>
              {t(game.turn < TURNS ? 'game.earlyEnding' : 'game.endingText')}
            </p>
          </>
        ) : card ? (
          <>
            <p className={site.badge}>
              {t(card.kind === 'luck' ? 'game.luck' : 'game.choice')}
            </p>
            <h2 id="game-step" tabIndex={-1}>
              {card.title[language]}
            </h2>
            <p>{card.text[language]}</p>
            <div className={styles.choices}>
              {card.choices.map((choice) => (
                <div key={choice.id}>
                  <button
                    type="button"
                    className={styles.choice}
                    aria-describedby={
                      choice.note ? `note-${choice.id}` : undefined
                    }
                    onClick={() => onChange(choose(game, choice.id))}
                  >
                    {card.kind === 'luck'
                      ? t('game.acknowledge')
                      : choice.label[language]}
                  </button>
                  {choice.note && (
                    <small id={`note-${choice.id}`} className={styles.note}>
                      {choice.note[language]}
                    </small>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 id="game-step" tabIndex={-1}>
              {t('game.stepResult')}
            </h2>
            <p>{resolvedCard?.title[language]}</p>
          </>
        )}
        {resolvedChoice && (
          <p className={styles.resolved} role="status">
            <strong>
              {t(
                resolvedCard?.kind === 'luck'
                  ? 'game.luckRevealed'
                  : 'game.chosen',
              )}
            </strong>{' '}
            {resolvedCard?.kind === 'luck'
              ? resolvedCard.title[language]
              : resolvedChoice.label[language]}
          </p>
        )}
      </section>
      <GameColumns state={game} before={before} />
      {over ? (
        <section className={site.section}>
          <h2>{t('game.topRules')}</h2>
          {topRules.length ? (
            <ol className={styles.topRules}>
              {topRules.map((rule) => (
                <li key={`${rule.ruleSetId}-${rule.id}`}>
                  <strong>{ruleTitle(rule.id, rule.ruleSetId)}</strong>
                  <span className={site.muted}>
                    {t('game.changedCount').replace(
                      '{count}',
                      String(rule.count),
                    )}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p>{t('game.noRuleChanges')}</p>
          )}
          <div className={site.actions}>
            <Link
              className={site.button}
              href={`/result#s=${encodeDraft(gameDraft(game))}`}
              prefetch={false}
            >
              {t('game.openTimeline')}
            </Link>
            <button
              type="button"
              className={site.secondary}
              onClick={() =>
                onChange(
                  startGame(game.characterId, Date.now() % 2 ** 31, locale),
                )
              }
            >
              {t('game.replay')}
            </button>
            <button
              type="button"
              className={site.secondary}
              onClick={() => onChange(undefined)}
            >
              {t('game.changeCharacter')}
            </button>
          </div>
        </section>
      ) : (
        <div className={site.actions}>
          {!card && (
            <button
              type="button"
              className={site.button}
              onClick={() => onChange(advance(game))}
            >
              {t('game.nextYear')}
            </button>
          )}
          <button
            type="button"
            className={site.secondary}
            onClick={() => onChange(undefined)}
          >
            {t('game.changeCharacter')}
          </button>
        </div>
      )}
    </>
  );
}
