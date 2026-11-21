import { newZealand2026_11 as nz } from '@uk-immigration/policy-data';
import { addDays, addYears } from './dates';
import { Days, HORIZON_YEARS, afterYears } from './pilot';
import type { PilotPathway, PilotResult, PilotStatus } from './pilot';
import { textFor } from './rule';
import type { IsoDate, Locale } from './types';

// New Zealand pilot (phase 18, task 60): resident visa travel conditions,
// the permanent resident visa by days in New Zealand, and citizenship
// presence. Residence categories themselves are out of scope.

export const NZ_RESIDENT_CATEGORIES = [
  'general',
  'parent',
  'religious-worker',
  'aip-growth',
  'aip-balanced',
] as const;

export type NzResidentCategory = (typeof NZ_RESIDENT_CATEGORIES)[number];

/** Left New Zealand on `departed`, came back on `returned`. */
export interface NzTrip {
  departed: IsoDate;
  returned: IsoDate;
}

export interface NzRequest {
  simulationDate: IsoDate;
  dateOfBirth: IsoDate;
  /** First arrival in New Zealand on any visa. */
  firstArrival: IsoDate;
  residentVisa: { granted: IsoDate; category: NzResidentCategory };
  /** Grant date of a permanent resident visa, if any. */
  permanentResidentVisa?: IsoDate;
  /** Last day of the travel conditions as printed on the visa, if known. */
  travelConditionsEnd?: IsoDate;
  /** The resident visa has s49(1) conditions not yet met and removed. */
  conditionsOutstanding?: boolean;
  trips: NzTrip[];
  locale?: Locale;
}

export type NzPathwayId = 'NZ-TRAVEL' | 'NZ-PRV' | 'NZ-CITIZENSHIP';
export type NzPathway = PilotPathway<NzPathwayId>;
export type NzResult = PilotResult<NzPathwayId>;

const v = nz.values;
const INVESTOR = new Set<NzResidentCategory>(['aip-growth', 'aip-balanced']);
const n = (x: number) => x.toLocaleString('en');

export function evaluateNewZealand(req: NzRequest): NzResult {
  const L = textFor(req);
  const sim = req.simulationDate;
  const granted = req.residentVisa.granted;
  const category = req.residentVisa.category;
  const prv = req.permanentResidentVisa;
  const days = new Days(
    addDays(addYears(sim, -v.citizenshipWindowYears.value), -1),
    addYears(sim, HORIZON_YEARS),
  );
  const flags = () => new Array<boolean>(days.count).fill(false);

  // Arrival and departure days count as days in New Zealand (RV1.15.5; the
  // DIA presence calculator, SRC-073).
  const away = flags();
  for (const trip of req.trips)
    days.mark(away, addDays(trip.departed, 1), addDays(trip.returned, -1));

  // First day in New Zealand as a resident (R5.66.5(b)): the grant day if
  // granted in New Zealand, else the first entry after the grant. A grant on
  // a departure day is taken to be in New Zealand.
  const abroadAtGrant = req.trips.find(
    (trip) => trip.departed < granted && granted < trip.returned,
  );
  const firstDay =
    granted < req.firstArrival
      ? req.firstArrival
      : (abroadAtGrant?.returned ?? granted);
  const offshoreGrant = firstDay !== granted;
  const firstEntryBy = addDays(
    afterYears(granted, v.firstEntryYears.value),
    -1,
  );
  const firstEntryOk = !offshoreGrant || firstDay <= firstEntryBy;
  const travelYears = v.travelYears.value[category];
  // The date printed on the visa wins over the category rule, which has
  // changed over the years (PD-087).
  const travelEnd =
    req.travelConditionsEnd ?? addDays(afterYears(firstDay, travelYears), -1);

  // RV1.5: the resident visa expires if you are outside New Zealand when the
  // travel conditions end, or leave after they ended; it expires the next
  // day (Visa Pak 588). A permanent resident visa by then keeps you a
  // resident. `lapse` is the first day without the resident visa.
  const lapse = req.trips
    .filter((trip) => trip.returned > firstDay && trip.returned > travelEnd)
    .map((trip) => (trip.departed > travelEnd ? trip.departed : travelEnd))
    .filter((at) => !(prv && prv <= at))
    .map((at) => addDays(at, 1))
    .sort()[0];

  const sums = {
    // Once the resident visa has expired, days count again only from a
    // permanent resident visa.
    resident: days.sums((i) => {
      const d = days.date(i);
      return (
        d >= firstDay &&
        !away[i] &&
        (!lapse || d < lapse || (!!prv && d >= prv))
      );
    }),
  };

  const firstDate = (ok: (d: IsoDate) => boolean): IsoDate | undefined => {
    for (let i = days.index(sim); i < days.count; i++) {
      const d = days.date(i);
      if (ok(d)) return d;
    }
    return undefined;
  };
  const statusOf = (earliest?: IsoDate): PilotStatus =>
    !earliest ? 'NOT_MET' : earliest === sim ? 'MET' : 'FUTURE';
  // PD-088: what happens once the resident visa has expired is not worked
  // out, so a date on or after that is unknown.
  const blocked = (earliest?: IsoDate) =>
    !!lapse && (!earliest || earliest >= lapse);
  // Religious Worker visas: a permanent resident visa 5 years after the first
  // day as a resident (SRC-073), once the s49(1) conditions are met.
  const religiousFrom =
    category === 'religious-worker'
      ? afterYears(firstDay, v.religiousWorkerYears.value)
      : undefined;

  const projection = L(
    '最早日期假设模拟日之后一直在新西兰（已录入的未来出境除外）。',
    'Projected dates assume you stay in New Zealand after the simulation date, apart from trips you entered.',
  );
  const firstDayNote = L(
    `首次以居民身份在新西兰之日按 ${firstDay} 计：境内获批的为获批日，境外获批的为之后首次入境日；出境当天获批的按在境内计。`,
    `Your first day in New Zealand as a resident is taken as ${firstDay}: the grant day if granted in New Zealand, otherwise your next arrival. A grant on a day you left counts as in New Zealand.`,
  );
  const lapsed = L(
    `居民签证在境外获批（${granted}），但首次入境（${firstDay}）晚于期限 ${firstEntryBy}；按 R5.66.1，须重新申请居民签证。`,
    `Your resident visa was granted outside New Zealand (${granted}) but your first arrival (${firstDay}) is after the deadline of ${firstEntryBy}; under R5.66.1 you would need to apply for a resident visa again.`,
  );
  const expired = L(
    `按录入的行程，旅行条件（到 ${travelEnd}）结束时你在境外或之后才出境，居民签证于 ${lapse} 失效（RV1.5）：须在那之前拿到永久居民签证或变更旅行条件（RV3），失效后只能另行申请；失效之后的结果待确认（PD-088）。`,
    `With the trips you entered, you are outside New Zealand when your travel conditions end (${travelEnd}) or leave after that, so your resident visa expires on ${lapse} (RV1.5): you need a permanent resident visa or a variation of travel conditions (RV3) before then, and after it expires only a new application is possible. Results after that cannot be worked out (PD-088).`,
  );
  const pathways: NzPathway[] = [];
  const hasPrv = !!prv && prv <= sim;

  // ---------- Travel conditions ----------
  {
    const title = L('居民签证的旅行条件', 'Resident visa travel conditions');
    const pending = firstEntryOk && firstDay > sim;
    const checks: NzPathway['checks'] = [];
    if (offshoreGrant)
      checks.push({
        text: L(
          `境外获批后在 ${firstEntryBy} 前首次入境（${firstDay}）`,
          `First arrival by ${firstEntryBy} after an offshore grant (${firstDay})`,
        ),
        // A planned first arrival has not happened yet.
        met: pending ? undefined : firstEntryOk,
        sources: v.firstEntryYears.sources,
      });
    checks.push({
      text: L(
        `旅行条件到期时人在新西兰，之后也没有出境（到 ${travelEnd}），或此前已有永久居民签证`,
        `In New Zealand when the travel conditions end (${travelEnd}) and no trips after that, or a permanent resident visa before then`,
      ),
      met: !lapse,
      sources: [
        ...v.travelYears.sources,
        { srcId: 'SRC-072', locator: 'RV1.5' },
        { srcId: 'SRC-071', locator: 's74(2)' },
      ],
    });
    const ok = firstEntryOk && !lapse;
    pathways.push(
      hasPrv
        ? {
            id: 'NZ-TRAVEL',
            title,
            status: 'NOT_APPLICABLE',
            summary: L(
              '模拟日已持永久居民签证，可随时往返新西兰（s73）。',
              'You hold a permanent resident visa on the simulation date, so you can travel to New Zealand at any time (s73).',
            ),
            checks: [],
            notChecked: [],
            assumptions: [],
          }
        : {
            id: 'NZ-TRAVEL',
            title,
            status: !ok ? 'NOT_MET' : pending ? 'FUTURE' : 'MET',
            earliestDate: !ok ? undefined : pending ? firstDay : sim,
            summary: !firstEntryOk
              ? lapsed
              : lapse
                ? expired
                : L(
                    `多次入境的旅行条件约到 ${travelEnd}。留在新西兰不受影响；那天人在境外或之后出境，居民签证就会失效（RV1.5），所以之后出行前须先拿到永久居民签证或变更旅行条件（RV3）。`,
                    `Your multiple-entry travel conditions run to about ${travelEnd}. Staying in New Zealand is not affected, but being outside New Zealand on that day or leaving after it ends your resident visa (RV1.5), so get a permanent resident visa or a variation of travel conditions (RV3) before travelling after then.`,
                  ),
            checks,
            notChecked: [
              L(
                '萨摩亚配额与太平洋准入类别的 3 个月首次入境期限、Active Investor Plus 子女随父母的旅行条件（R5.66）',
                'The 3-month first-entry deadline for the Samoan Quota and Pacific Access Category, and travel conditions that mirror an Active Investor Plus parent (R5.66)',
              ),
            ],
            assumptions: [
              firstDayNote,
              L(
                req.travelConditionsEnd
                  ? `旅行条件按你填写的签证上的日期（${req.travelConditionsEnd}）计。`
                  : `旅行条件按现行规则自首次以居民身份在新西兰之日起 ${travelYears} 年，周年前一天为最后一天；首次入境期限同样计。早年获批的签证适用当时的规则，请以签证上印的日期为准，填入表单即按该日期计（PD-087）。`,
                req.travelConditionsEnd
                  ? `Travel conditions follow the date on your visa that you entered (${req.travelConditionsEnd}).`
                  : `Travel conditions run ${travelYears} years from your first day as a resident under the current rule, ending the day before the anniversary; the first-entry deadline is counted the same way. Older visas follow the rules when they were granted, so go by the date printed on your visa and enter it in the form (PD-087).`,
              ),
            ],
            pendingDetails: ['PD-087', ...(lapse ? ['PD-088'] : [])],
          },
    );
  }

  // ---------- Permanent resident visa ----------
  {
    const title = L(
      '永久居民签证（在境天数）',
      'Permanent resident visa (days in New Zealand)',
    );
    // Visa Pak 588: 12 months are 365 days and 24 months 730, counted back
    // from the application date, not including it.
    const year = v.prvPeriodDays.value;
    const heldFrom = addDays(granted, v.prvHeldDays.value);
    const firstDayFrom = addDays(firstDay, v.prvFirstDayDays.value);
    const portions = (d: IsoDate) => [
      days.total(sums.resident, addDays(d, -2 * year), addDays(d, -year - 1)),
      days.total(sums.resident, addDays(d, -year), addDays(d, -1)),
    ];
    const ok = (need: number) => (d: IsoDate) =>
      d >= heldFrom &&
      d >= firstDayFrom &&
      (!religiousFrom || d >= religiousFrom) &&
      portions(d).every((x) => x >= need);
    const need = v.prvPortionDays.value;
    const notChecked = [
      L(
        '品格，以及满足 s49(1)、s50 附加条件（RV2.5(d)–(e)）',
        'Character, and meeting conditions under s49(1) or s50 (RV2.5(d)–(e))',
      ),
      L(
        '投资、在新西兰经营或安家等其他表明承诺的方式（RV2.5.10–RV2.5.20），以及居民签证已到期的前持有人（RV2.5(a)(ii)）',
        'The other ways to show commitment, such as investment, a business or a base in New Zealand (RV2.5.10–RV2.5.20), and former holders whose resident visa has expired (RV2.5(a)(ii))',
      ),
    ];
    if (hasPrv) {
      pathways.push({
        id: 'NZ-PRV',
        title,
        status: 'NOT_APPLICABLE',
        summary: L(
          '模拟日已持永久居民签证。',
          'You already hold a permanent resident visa on the simulation date.',
        ),
        checks: [],
        notChecked: [],
        assumptions: [],
      });
    } else if (INVESTOR.has(category)) {
      pathways.push({
        id: 'NZ-PRV',
        title,
        status: 'UNKNOWN',
        summary: L(
          'Active Investor Plus 居民签证转永居按 RV2.10，看投资条件是否已满足，本试点不判断。',
          'An Active Investor Plus resident visa moves to permanent residence under RV2.10, which depends on meeting the investment conditions; this pilot does not check them.',
        ),
        checks: [],
        notChecked: [
          L(
            '投资条件（RV2.10）与品格',
            'The investment conditions (RV2.10) and character',
          ),
        ],
        assumptions: [],
      });
    } else if (!firstEntryOk) {
      pathways.push({
        id: 'NZ-PRV',
        title,
        status: 'NOT_MET',
        summary: lapsed,
        checks: [],
        notChecked,
        assumptions: [],
      });
    } else {
      const earliest = firstDate(ok(need));
      const tax = firstDate(ok(v.prvTaxPortionDays.value));
      const stuck = blocked(earliest);
      // Parent and Religious Worker visas carry s49(1) conditions that must
      // be met and removed first (RV2.5(d); SRC-073).
      const conditional =
        category === 'parent' ||
        category === 'religious-worker' ||
        !!req.conditionsOutstanding;
      const [a, b] = portions(sim);
      pathways.push({
        id: 'NZ-PRV',
        title,
        status: stuck || conditional ? 'UNKNOWN' : statusOf(earliest),
        earliestDate: stuck || conditional ? undefined : earliest,
        summary:
          (stuck
            ? expired
            : conditional && earliest
              ? L(
                  `在境天数与年限的达标日是 ${earliest}。`,
                  `The days and years are met on ${earliest}.`,
                )
              : earliest === sim
                ? L(
                    `模拟日已满足永久居民签证的时间条件（RV2.5.1）。`,
                    'You meet the time requirements for a permanent resident visa on the simulation date (RV2.5.1).',
                  )
                : earliest
                  ? L(
                      `满足永久居民签证时间条件的最早递交日是 ${earliest}。`,
                      `The earliest application date that meets the time requirements for a permanent resident visa is ${earliest}.`,
                    )
                  : L(
                      '按现有记录，10 年内达不到在境天数要求。',
                      'With your record you will not meet the days requirement within 10 years.',
                    )) +
          (conditional && !stuck
            ? L(
                '你的居民签证带有 s49(1) 条件（父母类可能为 5 年或 10 年，宗教工作者须受担保从事宗教工作满 5 年，其他类别见签证），须先满足并申请取消，才能获批永久居民签证（RV2.5(d)），本试点不判断。',
                ' Your resident visa carries s49(1) conditions (5 or 10 years for Parent visas, 5 years of sponsored religious work for Religious Worker visas, otherwise as on your visa); they must be met and removed before a permanent resident visa can be granted (RV2.5(d)), which this pilot does not check.',
              )
            : '') +
          (!stuck && tax && (!earliest || tax < earliest) && !blocked(tax)
            ? L(
                `如果税务局确认你申请前 24 个月都是新西兰税务居民，走税务居民路线（每段 ${v.prvTaxPortionDays.value} 天）最早 ${tax}（RV2.5.5）。`,
                ` If Inland Revenue confirms you were a New Zealand tax resident for the 24 months before applying, the tax residence route (${v.prvTaxPortionDays.value} days in each part) is open from ${tax} (RV2.5.5).`,
              )
            : ''),
        checks: [
          {
            text: L(
              `持居民签证满 ${v.prvHeldDays.value} 天（${heldFrom}）`,
              `Held your resident visa for ${v.prvHeldDays.value} days (on ${heldFrom})`,
            ),
            met: sim >= heldFrom,
            sources: v.prvHeldDays.sources,
          },
          {
            text: L(
              `首次以居民身份在新西兰满 ${v.prvFirstDayDays.value} 天（${firstDayFrom}）`,
              `${v.prvFirstDayDays.value} days since your first day in New Zealand as a resident (on ${firstDayFrom})`,
            ),
            met: sim >= firstDayFrom,
            sources: v.prvFirstDayDays.sources,
          },
          ...(religiousFrom
            ? [
                {
                  text: L(
                    `宗教工作者成为居民满 ${v.religiousWorkerYears.value} 年（${religiousFrom}）`,
                    `${v.religiousWorkerYears.value} years as a resident on a Religious Worker visa (on ${religiousFrom})`,
                  ),
                  met: sim >= religiousFrom,
                  sources: v.religiousWorkerYears.sources,
                },
                {
                  text: L(
                    '宗教工作者的 s49 条件已满足并申请取消',
                    'Religious Worker s49 conditions met and removed',
                  ),
                  met: undefined,
                  sources: [
                    ...v.religiousWorkerYears.sources,
                    { srcId: 'SRC-072', locator: 'RV2.5(d)' },
                  ],
                },
              ]
            : []),
          {
            text: L(
              `申请前第 ${year + 1}–${2 * year} 天以居民身份在境 ${a} 天（至少 ${need} 天）`,
              `${a} days in New Zealand as a resident from ${2 * year} to ${year + 1} days before applying (${need} at least)`,
            ),
            met: a >= need,
            sources: v.prvPortionDays.sources,
          },
          {
            text: L(
              `申请前 ${year} 天内以居民身份在境 ${b} 天（至少 ${need} 天）`,
              `${b} days in New Zealand as a resident in the ${year} days before applying (${need} at least)`,
            ),
            met: b >= need,
            sources: v.prvPortionDays.sources,
          },
        ],
        notChecked,
        assumptions: [
          firstDayNote,
          L(
            `入境日与出境日都计为在境（RV1.15.5）。12 个月按 ${year} 天、24 个月按 ${2 * year} 天，从递交日往回数、不含递交当天（Visa Pak 588）。只算首次以居民身份在新西兰之日起的日子。`,
            `Arrival and departure days both count as days in New Zealand (RV1.15.5). 12 months are ${year} days and 24 months ${2 * year}, counted back from the application date, not including it (Visa Pak 588). Only days from your first day as a resident count.`,
          ),
          projection,
        ],
        pendingDetails: stuck ? ['PD-088'] : undefined,
      });
    }
  }

  // ---------- Citizenship by grant ----------
  {
    const title = L('入籍（在境天数）', 'Citizenship by grant (presence)');
    const notChecked = [
      L(
        '品格、英语、公民知识，以及打算继续在新西兰居住（s8(2)(c)–(f)）',
        'Good character, English, knowledge of citizenship, and intending to keep living in New Zealand (s8(2)(c)–(f))',
      ),
      L(
        '居民签证附加条件（如父母类、技术移民类的 s49(1) 条件）须已满足或取消（s8(3)）',
        'Any conditions on your resident visa (such as s49(1) conditions on Parent or Skilled Migrant visas) must be met or cancelled (s8(3))',
      ),
      L(
        'Crown service 视同在境、特殊情况下 20 个月内 450 天（s8(5)、s8(7)），16 岁以下随父母申请（s9），以及澳大利亚公民、萨摩亚公民等特殊情形',
        'Crown service counted as presence, the 450 days in 20 months for exceptional circumstances (s8(5), s8(7)), children under 16 applying with a parent (s9), and special cases such as Australian or Samoan citizens',
      ),
    ];
    if (!firstEntryOk) {
      pathways.push({
        id: 'NZ-CITIZENSHIP',
        title,
        status: 'NOT_MET',
        summary: lapsed,
        checks: [],
        notChecked,
        assumptions: [],
      });
    } else {
      const adult = afterYears(req.dateOfBirth, v.citizenshipMinAge.value);
      const window = v.citizenshipWindowYears.value;
      const total = v.citizenshipTotalDays.value;
      const perYear = v.citizenshipYearDays.value;
      const counts = (d: IsoDate, s: number[]) => {
        const years = Array.from({ length: window }, (_, k) =>
          days.total(s, addYears(d, -(k + 1)), addDays(addYears(d, -k), -1)),
        );
        return { total: years.reduce((x, y) => x + y, 0), years };
      };
      // Religious Worker conditions run 5 years from the first day as a
      // resident and must be removed first (s8(3); SRC-073). A permanent
      // resident visa has no conditions.
      const prvBy = (d: IsoDate) => !!prv && prv <= d;
      const ok = (s: number[]) => (d: IsoDate) => {
        const c = counts(d, s);
        return (
          d >= adult &&
          d >= firstDay &&
          (!religiousFrom || d >= religiousFrom || prvBy(d)) &&
          c.total >= total &&
          c.years.every((x) => x >= perYear)
        );
      };
      const earliest = firstDate(ok(sums.resident));
      const stuck = blocked(earliest);
      // Parent, Religious Worker and Active Investor Plus visas, and any visa
      // with outstanding conditions, need s49(1) conditions met or cancelled
      // first (s8(3)), unless a permanent resident visa has replaced them.
      const conditional =
        (category === 'parent' ||
          category === 'religious-worker' ||
          INVESTOR.has(category) ||
          !!req.conditionsOutstanding) &&
        !(earliest && prvBy(earliest));
      // The presence date alone, for the summary of an unknown result.
      const presence = conditional
        ? firstDate((d) => {
            const x = counts(d, sums.resident);
            return (
              d >= adult &&
              x.total >= total &&
              x.years.every((y) => y >= perYear)
            );
          })
        : earliest;
      const c = counts(sim, sums.resident);
      pathways.push({
        id: 'NZ-CITIZENSHIP',
        title,
        status: stuck || conditional ? 'UNKNOWN' : statusOf(earliest),
        earliestDate: stuck || conditional ? undefined : earliest,
        summary:
          (stuck
            ? expired
            : conditional && presence
              ? L(
                  `在境天数的达标日是 ${presence}。`,
                  `The presence requirement is met on ${presence}.`,
                ) +
                (religiousFrom && religiousFrom > presence
                  ? L(
                      `宗教工作者成为居民满 ${v.religiousWorkerYears.value} 年的日期是 ${religiousFrom}。`,
                      ` You reach ${v.religiousWorkerYears.value} years as a Religious Worker resident on ${religiousFrom}.`,
                    )
                  : '')
              : earliest === sim
                ? L(
                    '模拟日已满足入籍的在境天数要求。',
                    'You meet the presence requirement for citizenship on the simulation date.',
                  )
                : earliest
                  ? L(
                      `满足入籍在境天数要求的最早递交日是 ${earliest}。`,
                      `The earliest application date that meets the presence requirement is ${earliest}.`,
                    )
                  : L(
                      '按现有记录，10 年内达不到入籍的在境天数要求。',
                      'With your record you will not meet the presence requirement within 10 years.',
                    )) +
          (conditional && !stuck
            ? L(
                '你的居民签证带有 s49(1) 条件（父母类、宗教工作者、Active Investor Plus 都有，其他类别见签证），须已满足或取消才能入籍（s8(3)），本试点不判断；已获永久居民签证的则没有这些条件。',
                ' Your resident visa carries s49(1) conditions (Parent, Religious Worker and Active Investor Plus visas all do; otherwise see your visa), which must be met or cancelled before citizenship (s8(3)); this pilot does not check them, and a permanent resident visa has no such conditions.',
              )
            : ''),
        checks: [
          {
            text: L(
              `年满 ${v.citizenshipMinAge.value} 岁（${adult}）`,
              `Aged ${v.citizenshipMinAge.value} or over (from ${adult})`,
            ),
            met: sim >= adult,
            sources: v.citizenshipMinAge.sources,
          },
          {
            text: L(
              lapse && !prvBy(sim) && sim >= lapse
                ? `持居民签证或永久居民签证并已入境（居民签证已于 ${lapse} 失效）`
                : `持居民签证或永久居民签证并已入境（${firstDay}）`,
              lapse && !prvBy(sim) && sim >= lapse
                ? `Hold a resident or permanent resident visa and have entered on it (the resident visa expired on ${lapse})`
                : `Hold a resident or permanent resident visa and have entered on it (${firstDay})`,
            ),
            met: sim >= firstDay && (!lapse || sim < lapse || prvBy(sim)),
            sources: [
              { srcId: 'SRC-070', locator: 's8(2)(a)' },
              { srcId: 'SRC-071', locator: 's74(1)(b)' },
            ],
          },
          ...(religiousFrom
            ? [
                {
                  text: L(
                    `宗教工作者的 s49(1) 条件期满（${religiousFrom}），并已申请取消`,
                    `Religious Worker s49(1) conditions ended (${religiousFrom}) and removed`,
                  ),
                  met: prvBy(sim)
                    ? true
                    : sim >= religiousFrom
                      ? undefined
                      : false,
                  sources: [
                    ...v.religiousWorkerYears.sources,
                    { srcId: 'SRC-070', locator: 's8(3)' },
                  ],
                },
              ]
            : []),
          {
            text: L(
              `前 ${window} 年以居民身份在境合计 ${c.total} 天（至少 ${n(total)} 天）`,
              `${c.total} days in New Zealand as a resident in the past ${window} years (${n(total)} at least)`,
            ),
            met: c.total >= total,
            sources: v.citizenshipTotalDays.sources,
          },
          {
            text: L(
              `每一年至少 ${perYear} 天（由近到远：${c.years.join('、')} 天）`,
              `At least ${perYear} days in each year (latest first: ${c.years.join(', ')} days)`,
            ),
            met: c.years.every((x) => x >= perYear),
            sources: v.citizenshipYearDays.sources,
          },
        ],
        notChecked,
        assumptions: [
          firstDayNote,
          L(
            '5 年及每一年都从递交日往回数，不含递交当天（SRC-073）。只算持居民签证或永久居民签证、可无限期留在新西兰的日子（s8(2)(b)）。',
            'The 5 years and each year are counted back from the application date, not including it (SRC-073). Only days when you held a resident or permanent resident visa and could stay indefinitely count (s8(2)(b)).',
          ),
          L(
            '出入境当天都按在境计，与内政部官方在境计算器的计法一致（SRC-073 OIA 21/22-0423）。',
            'Arrival and departure days both count as in New Zealand, as the DIA presence calculator counts them (SRC-073 OIA 21/22-0423).',
          ),
          projection,
        ],
        pendingDetails: stuck ? ['PD-088'] : undefined,
      });
    }
  }

  return { policyAsOf: nz.asOf, pathways };
}
