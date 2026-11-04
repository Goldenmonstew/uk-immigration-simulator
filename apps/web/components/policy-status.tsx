import { t } from '../i18n';
import { ruleSets } from '../lib/policy';
import styles from '../app/site.module.css';

export function PolicyStatus({ asOf }: { asOf: string }) {
  return (
    <section className={styles.policy} aria-label={t('policy.asOf')}>
      <p>
        {t('policy.asOf')} <time dateTime={asOf}>{asOf}</time>
      </p>
      <div className={styles.badges}>
        {ruleSets.map((ruleSet) => (
          <span
            key={ruleSet.id}
            className={`${styles.badge} ${ruleSet.kind === 'ANNOUNCED' ? styles.announced : ''}`}
          >
            {t(`policy.${ruleSet.status}`)}
          </span>
        ))}
      </div>
    </section>
  );
}
