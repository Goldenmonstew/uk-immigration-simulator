import { australia2026_11 as au } from '@uk-immigration/policy-data';
import { addDays, addMonths, addYears, daysBetween } from './dates';
import { Days, HORIZON_YEARS, afterYears } from './pilot';
import type {
  PilotCheck,
  PilotPathway,
  PilotResult,
  PilotStatus,
} from './pilot';
import { textFor } from './rule';
import type { IsoDate, Locale } from './types';

// Australia pilot (phase 17): dates the Migration Regulations and the
// Citizenship Act fix by time alone. Points-tested entry visas are out of scope.

export const AU_PERMANENT_SUBCLASSES = [
  '189',
  '190',
  '191',
  '186',
  '801',
  '100',
  '155',
  'other-permanent',
] as const;
export const AU_TEMPORARY_SUBCLASSES = [
  '491',
  '494',
  '482',
  '457',
  '820',
  '309',
  'bridging-trt',
  'bridging',
  'other-temporary',
] as const;

export type AuSubclass =
  | (typeof AU_PERMANENT_SUBCLASSES)[number]
  | (typeof AU_TEMPORARY_SUBCLASSES)[number];

export interface AuVisa {
  subclass: AuSubclass;
  /** First day in effect. */
  from: IsoDate;
  /** Last day in effect; absent = still in effect. */
  to?: IsoDate;
}

/** Left Australia on `departed`, came back on `returned`. */
export interface AuTrip {
  departed: IsoDate;
  returned: IsoDate;
}

export interface AuRequest {
  simulationDate: IsoDate;
  dateOfBirth: IsoDate;
  /** First arrival in Australia; absent = not yet arrived. */
  firstArrival?: IsoDate;
  visas: AuVisa[];
  trips: AuTrip[];
  /**
   * 186 TRT: worked full time in Australia for an approved sponsor, in the
   * visa's occupation, throughout every 457/482 (or related bridging visa)
   * period after arriving, with no unpaid leave.
   */
  sponsoredFullTime?: boolean;
  /** Combined 820/801 (onshore) or 309/100 (offshore) partner application. */
  partnerApplication?: {
    lodged: IsoDate;
    stream: 'onshore' | 'offshore';
    /** Long-term partner relationship (reg 1.03) when the application was made. */
    longTermRelationship: boolean;
  };
  locale?: Locale;
}

export type AuPathwayId =
  'AU-191' | 'AU-186-TRT' | 'AU-PARTNER' | 'AU-RRV' | 'AU-CITIZENSHIP';

export type AuStatus = PilotStatus;
export type AuCheck = PilotCheck;
export type AuPathway = PilotPathway<AuPathwayId>;
export type AuResult = PilotResult<AuPathwayId>;

const v = au.values;
const PERMANENT = new Set<AuSubclass>(AU_PERMANENT_SUBCLASSES);
const TRT_VISAS = new Set<AuSubclass>(['457', '482']);
const BRIDGING = new Set<AuSubclass>(['bridging-trt', 'bridging']);
/** Most days `n` calendar years can span (leap days included). */
const longestYears = (n: number) => n * 365 + Math.ceil(n / 4);
// Permanent visas whose travel facility is 5 years from grant (x.511).
const FIVE_YEAR_FACILITY = new Set<AuSubclass>([
  '189',
  '190',
  '191',
  '186',
  '801',
  '100',
]);

export function evaluateAustralia(req: AuRequest): AuResult {
  const L = textFor(req);
  const sim = req.simulationDate;
  const days = new Days(
    addYears(sim, -v.rrvWindowYears.value),
    addYears(sim, HORIZON_YEARS),
  );
  const flags = () => new Array<boolean>(days.count).fill(false);

  // Departure and return days count as days in Australia (SRC-066; SRC-068
  // p6 text). The SOP p6 example counts the departure day as away (PD-084).
  const away = flags();
  const awayFromDeparture = flags();
  const departing = flags();
  for (const trip of req.trips) {
    days.mark(awayFromDeparture, trip.departed, addDays(trip.returned, -1));
    days.mark(away, addDays(trip.departed, 1), addDays(trip.returned, -1));
    days.mark(departing, trip.departed, trip.departed);
  }
  const arrived = (i: number) =>
    !!req.firstArrival && days.date(i) >= req.firstArrival;
  const present = (i: number) => arrived(i) && !away[i];

  /** In Australia at the end of `d`, from the full trip history. */
  const inAustraliaAtEnd = (d: IsoDate) =>
    !!req.firstArrival &&
    d >= req.firstArrival &&
    !req.trips.some((trip) => trip.departed <= d && d < trip.returned);

  // With dates only, a visa starting on a departure day may have come after
  // leaving: it is taken to start once you have left, and the visa it
  // replaces is held while you are still in Australia that day.
  const departsOn = (d: IsoDate) =>
    req.trips.some((trip) => trip.departed === d);
  // Migration Act s82(2)–(3): a later substantive visa ends a substantive
  // visa, and any later visa ends a bridging visa (visas starting the same
  // day are taken in the order entered).
  const sorted = [...req.visas].sort((a, b) => (a.from < b.from ? -1 : 1));
  const visas = sorted.map((x, n) => {
    const next = sorted
      .slice(n + 1)
      .find((o) => BRIDGING.has(x.subclass) || !BRIDGING.has(o.subclass));
    const replaced =
      next && (departsOn(next.from) ? next.from : addDays(next.from, -1));
    // Replaced only if still in effect when the next visa starts.
    const isReplaced = !!next && (!x.to || next.from <= x.to);
    const to = isReplaced ? replaced : x.to;
    // s82(5)–(6): a 5-year travel facility ends the visa if you are outside
    // Australia when it runs out without a new visa having started, or when
    // you leave after it.
    if (FIVE_YEAR_FACILITY.has(x.subclass)) {
      const after = afterYears(x.from, v.travelFacilityYears.value);
      const last = addDays(after, -1);
      if (
        !inAustraliaAtEnd(last) &&
        (!next || next.from > last) &&
        (!x.to || x.to >= last)
      )
        return { ...x, to: last, replacedBy: undefined, left: undefined };
      const left = req.trips
        .map((trip) => trip.departed)
        .filter((d) => d >= after)
        .sort()[0];
      if (left && (!to || left <= to))
        return { ...x, to: left, replacedBy: undefined, left };
    }
    return {
      ...x,
      to,
      replacedBy: isReplaced ? next : undefined,
      left: undefined,
    };
  });
  // Each kind of visa held on a day, and held from before the day (so also
  // while still in Australia when leaving that day).
  const held = () => ({ on: flags(), before: flags() });
  const permanent = held();
  const temporary = held();
  const visa = held();
  const trtVisa = held();
  const mark = ({ on, before }: ReturnType<typeof held>, x: AuVisa) => {
    days.mark(on, x.from, x.to);
    if (!x.to || x.to > x.from) days.mark(before, addDays(x.from, 1), x.to);
  };
  // Days with a moment when you were outside Australia without a permanent
  // visa: the day one ended on leaving (s82(6)), and the first day of one
  // that started while you were abroad (after leaving, while away or before
  // returning) without directly replacing your previous permanent visa.
  const gap = flags();
  let lastSubstantive: AuSubclass | undefined;
  visas.forEach((x, n) => {
    mark(visa, x);
    mark(PERMANENT.has(x.subclass) ? permanent : temporary, x);
    if (x.left) days.mark(gap, x.left, x.left);
    // A permanent visa replaced after leaving by a temporary one.
    if (
      PERMANENT.has(x.subclass) &&
      x.replacedBy &&
      !PERMANENT.has(x.replacedBy.subclass) &&
      x.to === x.replacedBy.from
    )
      days.mark(gap, x.to, x.to);
    const previous = visas
      .slice(0, n)
      .filter((p) => PERMANENT.has(p.subclass))
      .at(-1);
    const abroad =
      !inAustraliaAtEnd(x.from) ||
      req.trips.some((trip) => trip.returned === x.from);
    if (
      PERMANENT.has(x.subclass) &&
      !!req.firstArrival &&
      x.from > req.firstArrival &&
      abroad &&
      previous?.replacedBy !== sorted[n]
    )
      days.mark(gap, x.from, x.from);
    // 186.226(1)(d): a bridging visa for a 457, 482, 186 or 187 application
    // counts when the last substantive visa was a 457 or 482.
    if (
      TRT_VISAS.has(x.subclass) ||
      (x.subclass === 'bridging-trt' &&
        lastSubstantive &&
        TRT_VISAS.has(lastSubstantive))
    )
      mark(trtVisa, x);
    if (!BRIDGING.has(x.subclass)) lastSubstantive = x.subclass;
  });
  /** Held while in Australia on day `i` (on a departure day, before leaving). */
  const beforeLeaving = ({ on, before }: ReturnType<typeof held>, i: number) =>
    departing[i] ? before[i] : on[i];
  // Citizenship Act s5(1)(a)–(b): outside Australia, a permanent visa makes
  // you a permanent resident only if you held one when you last left.
  const resident = flags();
  let leftAsResident = arrived(0) && permanent.on[0];
  for (let i = 0; i < days.count; i++) {
    if (present(i)) {
      leftAsResident = beforeLeaving(permanent, i);
      resident[i] = leftAsResident && !gap[i];
    } else resident[i] = permanent.on[i] && leftAsResident && !gap[i];
  }
  const sums = {
    // 155.212(2)(b): days also on a temporary or bridging visa do not count.
    rrv: days.sums(
      (i) =>
        beforeLeaving(permanent, i) &&
        !beforeLeaving(temporary, i) &&
        present(i),
    ),
    unlawful: days.sums((i) => present(i) && !beforeLeaving(visa, i)),
    notResident: days.sums((i) => !resident[i]),
    away: days.sums((i) => away[i]),
    awayFromDeparture: days.sums((i) => awayFromDeparture[i]),
  };
  /** Continuous runs of flagged days, as [first, last] dates. */
  const runs = (flag: (i: number) => boolean) => {
    const list: [IsoDate, IsoDate][] = [];
    for (let i = 0; i < days.count; i++) {
      if (!flag(i)) continue;
      const first = i;
      while (i + 1 < days.count && flag(i + 1)) i++;
      list.push([days.date(first), days.date(i)]);
    }
    return list;
  };

  /** First date from the simulation date on which `ok` holds. */
  const firstDate = (ok: (d: IsoDate) => boolean): IsoDate | undefined => {
    for (let i = days.index(sim); i < days.count; i++) {
      const d = days.date(i);
      if (ok(d)) return d;
    }
    return undefined;
  };

  const projection = L(
    '最早日期假设模拟日之后一直在澳（已录入的未来出境除外），签证按录入的起止日。',
    'Projected dates assume you stay in Australia after the simulation date (apart from trips you entered) and that each visa runs for the dates entered.',
  );

  const pathways: AuPathway[] = [];
  const statusOf = (earliest?: IsoDate): AuStatus =>
    !earliest ? 'NOT_MET' : earliest === sim ? 'MET' : 'FUTURE';

  const permanentNow = visas
    .filter((x) => PERMANENT.has(x.subclass) && x.from <= sim)
    .filter((x) => !x.to || x.to >= sim);
  const alreadyPermanent = L(
    '模拟日已持永久签证，不需要这条转永居路径。',
    'You already hold a permanent visa on the simulation date, so this pathway is not needed.',
  );

  // ---------- Subclass 191 ----------
  {
    const title = L(
      '191 永居（地区临时签证转永居）',
      'Subclass 191 permanent residence (from a regional provisional visa)',
    );
    const current = visas
      .filter(
        (x) => (x.subclass === '491' || x.subclass === '494') && x.from <= sim,
      )
      .filter((x) => !x.to || x.to >= sim)
      .at(-1);
    const notChecked = [
      L(
        '遵守签证条件，包括地区居住与工作的条件 8579（191.221）',
        'Complying with your visa conditions, including condition 8579 on living and working in regional areas (191.221)',
      ),
      L(
        '3 个相关财年的 ATO 税务评估通知；没有最低收入要求（191.222；SRC-063）',
        'ATO notices of assessment for 3 relevant income years; there is no minimum income (191.222; SRC-063)',
      ),
      L(
        '健康、品格等公共利益条件',
        'Health, character and other public interest criteria',
      ),
    ];
    if (!current || permanentNow.length) {
      pathways.push({
        id: 'AU-191',
        title,
        status: 'NOT_APPLICABLE',
        summary: permanentNow.length
          ? alreadyPermanent
          : L(
              '模拟日没有持有 491 或 494 签证。',
              'You do not hold a subclass 491 or 494 visa on the simulation date.',
            ),
        checks: [],
        notChecked,
        assumptions: [],
      });
    } else {
      const due = afterYears(current.from, v.regionalProvisionalYears.value);
      const reachable = !current.to || current.to >= due;
      const earliest = reachable ? (due > sim ? due : sim) : undefined;
      pathways.push({
        id: 'AU-191',
        title,
        status: statusOf(earliest),
        earliestDate: earliest,
        summary: reachable
          ? L(
              `持当前 ${current.subclass} 签证满 3 年的日期是 ${due}，届时须仍持有该签证。`,
              `You will have held your current subclass ${current.subclass} visa for 3 years on ${due}; you must still hold it then.`,
            )
          : L(
              `当前 ${current.subclass} 签证在 ${current.to} 到期，早于持满 3 年的 ${due}。`,
              `Your current subclass ${current.subclass} visa ends on ${current.to}, before you would have held it for 3 years on ${due}.`,
            ),
        checks: [
          {
            text: L(
              `已持有当前 ${current.subclass} 签证满 3 年（${due} 满）`,
              `Held the current subclass ${current.subclass} visa for 3 years (on ${due})`,
            ),
            met: sim >= due,
            sources: v.regionalProvisionalYears.sources,
          },
        ],
        notChecked,
        assumptions: [],
      });
    }
  }

  // ---------- Subclass 186 Temporary Residence Transition ----------
  {
    const title = L(
      '186 雇主担保永居（临时居民过渡类别）',
      'Subclass 186 Temporary Residence Transition stream',
    );
    const notChecked = [
      L(
        '须是 457／482 的主签证持有人（SRC-064）',
        'Being the primary holder of the 457 or 482 visa (SRC-064)',
      ),
      L(
        '雇主提名已获批，并在获批后 6 个月内递交（186.223）',
        'An approved nomination, with the application made within 6 months of approval (186.223)',
      ),
      L('Competent English（186.222）', 'Competent English (186.222)'),
      L(
        '健康、品格等公共利益条件',
        'Health, character and other public interest criteria',
      ),
    ];
    const birthday45 = afterYears(req.dateOfBirth, v.trtMaxAge.value);
    const longest = longestYears(v.trtHeldYears.value);
    const trtRuns = runs((i) => trtVisa.on[i]);
    const workRuns = runs((i) => beforeLeaving(trtVisa, i) && present(i));
    // PD-085: one continuous period of 2 calendar years in the window meets
    // it; separate periods need the most days 2 years can have.
    const total = (d: IsoDate, list: [IsoDate, IsoDate][]) => {
      const from = addYears(d, -v.trtWindowYears.value);
      const to = addDays(d, -1);
      let count = 0;
      let whole = false;
      for (const [a, b] of list) {
        const first = a > from ? a : from;
        const last = b < to ? b : to;
        if (first > last) continue;
        count += daysBetween(first, last) + 1;
        if (afterYears(first, v.trtHeldYears.value) <= addDays(last, 1))
          whole = true;
      }
      return { days: count, met: whole || count >= longest };
    };
    const holds = (d: IsoDate) => trtVisa.on[days.index(d)];
    const ready = (d: IsoDate, work: boolean) =>
      holds(d) && total(d, trtRuns).met && (!work || total(d, workRuns).met);
    const work = !!req.sponsoredFullTime;
    if (
      !trtVisa.on.slice(days.index(sim)).some(Boolean) ||
      permanentNow.length
    ) {
      pathways.push({
        id: 'AU-186-TRT',
        title,
        status: 'NOT_APPLICABLE',
        summary: permanentNow.length
          ? alreadyPermanent
          : L(
              '模拟日及之后没有 457、482 签证或相关的 bridging visa。',
              'You have no subclass 457 or 482 visa, or a related bridging visa, on or after the simulation date.',
            ),
        checks: [],
        notChecked,
        assumptions: [],
      });
    } else {
      const reached = firstDate((d) => ready(d, work));
      const visaReached = work ? firstDate((d) => ready(d, false)) : reached;
      const earliest = reached && reached < birthday45 ? reached : undefined;
      const status: AuStatus = !earliest
        ? 'NOT_MET'
        : !work
          ? 'UNKNOWN'
          : statusOf(earliest);
      const summary = !visaReached
        ? L(
            '按录入的签证，达不到申请时持 457／482（或相关 bridging visa）且 3 年内合计满 2 年。',
            'With the visas entered, you will not both hold a 457/482 (or related bridging) visa when applying and have a total of 2 years on one within 3 years.',
          )
        : !reached
          ? L(
              `持签条件在 ${visaReached} 满足，但入境后在澳全职受雇，3 年内达不到 2 年。`,
              `The visa requirements are met on ${visaReached}, but you will not have 2 years of full-time work in Australia after arriving within 3 years.`,
            )
          : !earliest
            ? L(
                `${work ? '时间条件' : '持签时长'}到 ${reached} 才满足，届时已满 45 岁（${birthday45}）；只有文书列明的豁免类别可以申请。`,
                `The ${work ? 'time' : 'visa'} requirements are only met on ${reached}, after you turn 45 on ${birthday45}; only exempt classes in a legislative instrument can apply.`,
              )
            : !work
              ? L(
                  `持签条件在 ${earliest} 满足；你没有确认一直全职为担保雇主工作，全职受雇满 2 年（186.227）须另算，本页没有给出最早日期。`,
                  `The visa requirements are met on ${earliest}; you have not confirmed full-time work for your sponsor throughout, so count your 2 years of full-time sponsored work (186.227) separately. No earliest date is given.`,
                )
              : earliest === sim
                ? L(
                    `模拟日已满足持签与全职受雇的时间条件；须在 ${birthday45} 满 45 岁之前递交。`,
                    `You meet the visa and full-time work time requirements on the simulation date; apply before you turn 45 on ${birthday45}.`,
                  )
                : L(
                    `满足持签与全职受雇时间条件的最早日期是 ${earliest}；须在 ${birthday45} 满 45 岁之前递交。`,
                    `The earliest date meeting the visa and full-time work time requirements is ${earliest}; apply before you turn 45 on ${birthday45}.`,
                  );
      const held = total(sim, trtRuns);
      const worked = total(sim, workRuns);
      pathways.push({
        id: 'AU-186-TRT',
        title,
        status,
        earliestDate: work ? earliest : undefined,
        summary,
        checks: [
          {
            text: L(
              `前 3 年持 457／482（含相关 bridging visa）合计 ${held.days} 天（需连续满 2 年，或分段合计 ${longest} 天）`,
              `${held.days} days on a 457/482 (or related bridging) visa in the past 3 years (2 continuous years, or ${longest} days in separate periods)`,
            ),
            met: held.met,
            sources: [
              ...v.trtHeldYears.sources,
              { srcId: 'SRC-069', locator: 's82(2)–(3)' },
            ],
          },
          {
            text: work
              ? L(
                  `前 3 年在澳全职受雇于担保雇主 ${worked.days} 天（按你的回答，出境期间不计，同上计法）`,
                  `${worked.days} days of full-time sponsored work in Australia in the past 3 years (your answer, without time outside Australia, counted the same way)`,
                )
              : L(
                  '全职受雇于担保雇主满 2 年：你没有确认，本页未计算',
                  '2 years of full-time sponsored work: not confirmed, so not counted here',
                ),
            met: work ? worked.met : undefined,
            sources: [
              { srcId: 'SRC-062', locator: '186.227(1)' },
              v.trtHeldYears.sources[2],
            ],
          },
          {
            text: L(
              '递交时持 457／482 或相关 bridging visa',
              'Holding a 457/482 or related bridging visa when applying',
            ),
            met: holds(sim),
            sources: [
              { srcId: 'SRC-064', locator: 'Eligibility → Have this visa' },
            ],
          },
          {
            text: L(
              `申请时未满 45 岁（${birthday45} 满 45 岁）`,
              `Under 45 when applying (you turn 45 on ${birthday45})`,
            ),
            met: sim < birthday45,
            sources: v.trtMaxAge.sources,
          },
        ],
        notChecked,
        assumptions: [
          L(
            '"合计 2 年"：窗口内连续一段满 2 个日历年即可；分成多段时按 2 年最多的天数（731 天）计，门槛最多比按 730 天多一天，若那天已不持合格签证，日期会更晚（PD-085）。',
            '"A total of 2 years": one continuous period of 2 calendar years in the window is enough; separate periods are counted against the most days 2 years can have (731), at most one day more than 730, though the date moves further if you no longer hold a qualifying visa that day (PD-085).',
          ),
          L(
            '全职受雇只计入境后在澳的日子；出境期间（包括可能计入的境外带薪假）一律不计。',
            'Full-time work counts only days in Australia after you arrived; time outside Australia, including paid leave that might count, is left out.',
          ),
          L(
            '"相关 bridging visa" 指因申请 457、482、186 或 187 而获发、且上一份实质签证是 457／482 的 bridging visa（186.226(1)(d)）。',
            'A "related bridging visa" is one granted for a 457, 482, 186 or 187 application when your last substantive visa was a 457 or 482 (186.226(1)(d)).',
          ),
          projection,
        ],
        pendingDetails: ['PD-085'],
      });
    }
  }

  // ---------- Partner visa permanent stage ----------
  {
    const title = L(
      '伴侣签永久阶段（801／100）',
      'Partner visa permanent stage (subclass 801 or 100)',
    );
    const p = req.partnerApplication;
    if (!p || permanentNow.length) {
      pathways.push({
        id: 'AU-PARTNER',
        title,
        status: 'NOT_APPLICABLE',
        summary: permanentNow.length
          ? alreadyPermanent
          : L(
              '没有录入伴侣签申请。',
              'You have not entered a partner visa application.',
            ),
        checks: [],
        notChecked: [],
        assumptions: [],
      });
    } else {
      const temporary = p.stream === 'onshore' ? '820' : '309';
      const permanentVisa = p.stream === 'onshore' ? '801' : '100';
      const due = p.longTermRelationship
        ? p.lodged
        : afterYears(p.lodged, v.partnerWaitYears.value);
      const earliest = due > sim ? due : sim;
      pathways.push({
        id: 'AU-PARTNER',
        title,
        status: statusOf(earliest),
        earliestDate: earliest,
        summary: p.longTermRelationship
          ? L(
              `递交时已是长期伴侣关系，${permanentVisa} 不受递交满 2 年的限制。`,
              `You were in a long-term partner relationship when you applied, so the 2-year wait for the ${permanentVisa} does not apply.`,
            )
          : L(
              `${permanentVisa} 永久阶段自 ${due}（递交满 2 年）起评估；移民局也可能更早拒签，或因特殊情形更早批准。`,
              `The ${permanentVisa} permanent stage is assessed from ${due}, 2 years after you applied; the department can refuse earlier, or approve earlier in special circumstances.`,
            ),
        checks: [
          {
            text: p.longTermRelationship
              ? L(
                  '递交时已是长期伴侣关系：以配偶或事实伴侣身份满 3 年；有双方共同的受抚养子女（不含继子女）时满 2 年',
                  'A long-term partner relationship when applying: 3 years as spouses or de facto partners, or 2 years with a dependent child of you both (not a step-child)',
                )
              : L(
                  `递交满 2 年（${due} 满）`,
                  `2 years since you applied (on ${due})`,
                ),
            met: sim >= due,
            sources: v.partnerWaitYears.sources,
          },
        ],
        notChecked: [
          L(
            `届时仍持 ${temporary} 签证，仍与担保伴侣保持关系并受其担保`,
            `Still holding the ${temporary} visa, still in the relationship and sponsored by your partner`,
          ),
          ...(p.stream === 'offshore'
            ? [
                L(
                  '担保伴侣持有或曾持有永久人道签证，且获签前你们已是配偶或事实伴侣、并已告知移民局时，也不受 2 年限制（100.221(6)）',
                  'The 2-year wait also does not apply if your sponsoring partner holds or held a permanent humanitarian visa and, before it was granted, you were already spouses or de facto partners and the department was told (100.221(6))',
                ),
              ]
            : []),
          L(
            '健康、品格等公共利益条件',
            'Health, character and other public interest criteria',
          ),
        ],
        assumptions: [],
      });
    }
  }

  // ---------- Resident Return visa ----------
  {
    const title = L(
      '回头签 RRV（155，5 年旅行便利）',
      'Resident Return visa (subclass 155, 5-year travel facility)',
    );
    const notChecked = [
      L(
        '不满 2 年时按与澳洲的实质联系申请（155.212(3)、(3A)），最多给 1 年旅行便利',
        'Applying on substantial ties instead (155.212(3), (3A)), which gives at most a 1-year travel facility',
      ),
      L(
        '前永久居民、前公民申请 RRV（155.211(b)–(c)）',
        'RRV applications by former permanent residents or former citizens (155.211(b)–(c))',
      ),
      L('公共利益条件 4021', 'Public interest criterion 4021'),
    ];
    if (!permanentNow.length) {
      pathways.push({
        id: 'AU-RRV',
        title,
        status: 'NOT_APPLICABLE',
        summary: L(
          '模拟日没有持有永久签证。',
          'You do not hold a permanent visa on the simulation date.',
        ),
        checks: [],
        notChecked,
        assumptions: [],
      });
    } else {
      const inAustralia = (d: IsoDate) =>
        days.total(
          sums.rrv,
          addYears(d, -v.rrvWindowYears.value),
          addDays(d, -1),
        );
      const earliest = firstDate(
        (d) =>
          permanent.on[days.index(d)] &&
          inAustralia(d) >= v.rrvPresenceDays.value,
      );
      const latest = permanentNow[permanentNow.length - 1];
      const facility = !FIVE_YEAR_FACILITY.has(latest.subclass)
        ? L(
            '当前永久签证的旅行便利期以签证通知或 VEVO 为准（RRV 取决于获批时符合的条件，155.511）；',
            'Check the travel facility on your current permanent visa in your grant notice or VEVO (for an RRV it depends on the criteria it was granted under, 155.511).',
          )
        : L(
            `当前永久签证的旅行便利自 ${latest.from} 起 5 年，约到 ${addYears(latest.from, v.travelFacilityYears.value)}（以签证通知或 VEVO 为准）；`,
            `The travel facility on your current permanent visa runs 5 years from ${latest.from}, to about ${addYears(latest.from, v.travelFacilityYears.value)} (check your grant notice or VEVO).`,
          );
      pathways.push({
        id: 'AU-RRV',
        title,
        status: statusOf(earliest),
        earliestDate: earliest,
        summary:
          facility +
          L(
            '此后出境，须持 RRV 才能以永久居民身份返澳。' +
              (earliest === sim
                ? '前 5 年内已以永久签证持有人身份在澳满 730 天。'
                : earliest
                  ? `5 年内在澳满 730 天的最早递交日是 ${earliest}。`
                  : '按现有记录达不到 5 年内在澳 730 天。'),
            ' After that you need an RRV to come back as a permanent resident.' +
              (earliest === sim
                ? ' You already have 730 days in Australia as a permanent visa holder in the past 5 years.'
                : earliest
                  ? ` The earliest application date with 730 days in Australia in 5 years is ${earliest}.`
                  : ' With your record you will not reach 730 days in Australia in 5 years.'),
          ),
        checks: [
          {
            text: L(
              `前 5 年以永久签证持有人身份在澳 ${inAustralia(sim)} 天（需 730 天）`,
              `${inAustralia(sim)} days in Australia as a permanent visa holder in the past 5 years (730 needed)`,
            ),
            met: inAustralia(sim) >= v.rrvPresenceDays.value,
            sources: [
              ...v.rrvPresenceDays.sources,
              { srcId: 'SRC-069', locator: 's82(2)–(6)' },
            ],
          },
        ],
        notChecked,
        assumptions: [
          L(
            '入境日与出境日都计为在澳（SRC-066）。同时持有 bridging visa 等临时签证的日子不计（155.212(2)(b)）；较早的临时实质签证在永久签证生效时已终止（s82(2)）。',
            'Arrival and departure days both count as days in Australia (SRC-066). Days when you also held a bridging or other temporary visa do not count (155.212(2)(b)); an earlier temporary substantive visa ends when a permanent visa comes into effect (s82(2)).',
          ),
          L(
            '出境当天生效的签证视为离境后才生效；在旅行便利期满后离境的当天递交，按离境前递交计。',
            'A visa starting on a departure day is taken to start after you left; applying on the day you leave after the travel facility ends is taken to be before leaving.',
          ),
          projection,
        ],
      });
    }
  }

  // ---------- Citizenship by conferral ----------
  {
    const title = L(
      '入籍（一般居住要求）',
      'Citizenship by conferral (general residence requirement)',
    );
    const notChecked = [
      L(
        '入籍考试、英语基础知识、品格，以及打算在澳居住或保持联系（s21(2)(d)–(h)）',
        'The citizenship test, basic English, character, and intending to live in or keep close ties with Australia (s21(2)(d)–(h))',
      ),
      L(
        '决定时仍是永久居民（s21(2)(b)(ii)）；4 年内曾被监禁或依法院命令收治（s22(1C)）',
        'Still being a permanent resident at the decision (s21(2)(b)(ii)); any time in prison or court-ordered psychiatric confinement in the 4 years (s22(1C))',
      ),
      L(
        '居住要求的豁免与部长裁量（s22(2)–(11)、s22A–22C），以及 SCV 444 持有人、部分新西兰 189 签证持有人的特殊起算（SRC-067）',
        'Exemptions and ministerial discretion (s22(2)–(11), s22A–22C), and the special start dates for SCV 444 holders and some New Zealand 189 visa holders (SRC-067)',
      ),
    ];
    if (!visas.some((x) => PERMANENT.has(x.subclass))) {
      pathways.push({
        id: 'AU-CITIZENSHIP',
        title,
        status: 'NOT_APPLICABLE',
        summary: L(
          '记录中没有永久签证；入籍须先以永久居民身份在澳满 12 个月。',
          'Your record has no permanent visa; you need 12 months as a permanent resident before citizenship.',
        ),
        checks: [],
        notChecked,
        assumptions: [],
      });
    } else {
      const adult = afterYears(req.dateOfBirth, v.citizenshipMinAge.value);
      const fourYears =
        req.firstArrival &&
        afterYears(req.firstArrival, v.citizenshipResidenceYears.value);
      const facts = (d: IsoDate, absences: number[]) => {
        const start = addYears(d, -v.citizenshipResidenceYears.value);
        const recent = addMonths(d, -v.citizenshipPermanentMonths.value);
        return {
          absent: days.total(absences, start, addDays(d, -1)),
          unlawful: days.total(sums.unlawful, start, addDays(d, -1)),
          notResident: days.total(sums.notResident, recent, d),
          recentAbsent: days.total(absences, recent, addDays(d, -1)),
        };
      };
      const ok = (absences: number[]) => (d: IsoDate) => {
        const f = facts(d, absences);
        return (
          d >= adult &&
          !!fourYears &&
          d >= fourYears &&
          f.absent <= v.citizenshipAbsenceDays.value &&
          f.unlawful === 0 &&
          f.notResident === 0 &&
          f.recentAbsent <= v.citizenshipRecentAbsenceDays.value
        );
      };
      const earliest = firstDate(ok(sums.away));
      // PD-084: the SOP p6 example counts each departure day as away.
      const example = firstDate(ok(sums.awayFromDeparture));
      const f = facts(sim, sums.away);
      pathways.push({
        id: 'AU-CITIZENSHIP',
        title,
        status: statusOf(earliest),
        earliestDate: earliest,
        summary:
          (earliest === sim
            ? L(
                '模拟日已满足一般居住要求。',
                'You meet the general residence requirement on the simulation date.',
              )
            : earliest
              ? L(
                  `满足一般居住要求的最早递交日是 ${earliest}。`,
                  `The earliest application date that meets the general residence requirement is ${earliest}.`,
                )
              : L(
                  '按现有记录，10 年内达不到一般居住要求。',
                  'With your record you will not meet the general residence requirement within 10 years.',
                )) +
          (example === earliest
            ? ''
            : L(
                `按 SOP 示例的计法（出境当天算不在澳），${example ? `最早为 ${example}` : '10 年内达不到'}（PD-084）。`,
                ` Counting each departure day as away, as in the SOP example, ${example ? `the earliest date is ${example}` : 'it is not met within 10 years'} (PD-084).`,
              )),
        checks: [
          {
            text: L(
              `年满 18 岁（${adult}）`,
              `Aged 18 or over (from ${adult})`,
            ),
            met: sim >= adult,
            sources: v.citizenshipMinAge.sources,
          },
          {
            text: fourYears
              ? L(
                  `首次入境满 4 年（${fourYears}）`,
                  `4 years since you first arrived (on ${fourYears})`,
                )
              : L(
                  '首次入境满 4 年（尚未入境）',
                  '4 years since you first arrived (not arrived yet)',
                ),
            met: !!fourYears && sim >= fourYears,
            sources: v.citizenshipResidenceYears.sources,
          },
          {
            text: L(
              `前 4 年出境合计 ${f.absent} 天（上限 365 天）`,
              `${f.absent} days outside Australia in the past 4 years (365 at most)`,
            ),
            met: f.absent <= v.citizenshipAbsenceDays.value,
            sources: v.citizenshipAbsenceDays.sources,
          },
          {
            text: L(
              `前 4 年在澳期间一直持有签证（无签证 ${f.unlawful} 天）`,
              `A visa throughout your time in Australia in the past 4 years (${f.unlawful} days without one)`,
            ),
            met: f.unlawful === 0,
            sources: [{ srcId: 'SRC-061', locator: 's22(1)(b)' }],
          },
          {
            text: L(
              '前 12 个月及递交日一直是永久居民',
              'A permanent resident throughout the past 12 months and on the application date',
            ),
            met: f.notResident === 0,
            sources: [
              ...v.citizenshipPermanentMonths.sources,
              { srcId: 'SRC-061', locator: 's5(1)' },
              { srcId: 'SRC-061', locator: 's21(2)(b)(i)' },
              { srcId: 'SRC-069', locator: 's82(2)–(6)' },
            ],
          },
          {
            text: L(
              `前 12 个月出境合计 ${f.recentAbsent} 天（上限 90 天）`,
              `${f.recentAbsent} days outside Australia in the past 12 months (90 at most)`,
            ),
            met: f.recentAbsent <= v.citizenshipRecentAbsenceDays.value,
            sources: v.citizenshipRecentAbsenceDays.sources,
          },
        ],
        notChecked,
        assumptions: [
          L(
            '出境日与入境日都计为在澳（SRC-068 p6 正文）。同页示例把出境当天算作不在澳，两者不同时，摘要另列按示例算出的日期（PD-084）。',
            'Departure and arrival days both count as days in Australia (SRC-068 p6 text). The example on the same page counts the departure day as away; where that changes the date, the summary also gives the date counted that way (PD-084).',
          ),
          L(
            '离境时已持永久签证、且新旧永久签证之间没有空档的，在境外换发的新永久签证仍连续算永久居民；旧签证先终止、新签证后获发的，空档当天不算。离境时没有永久签证的，在境外获发的永久签证要等持签入境后才算（s5(1)）。出境当天生效的签证视为离境后才生效。',
            'If you held a permanent visa when you left and the new one granted abroad follows it with no gap, you stay a permanent resident; where the old visa ended before the new one was granted, the day of the gap does not count. If you held none when you left, a permanent visa granted abroad counts only once you enter Australia on it (s5(1)). A visa starting on a departure day is taken to start after you left.',
          ),
          L(
            '155 和其他永久签证的旅行便利期不推算：若在其期满后离境，永居可能已终止（s82(5)–(6)），请以签证通知或 VEVO 为准。',
            'The travel facility of a 155 or other permanent visa is not worked out: leaving after it ends may have ended your permanent visa (s82(5)–(6)), so check your grant notice or VEVO.',
          ),
          projection,
        ],
        pendingDetails: example === earliest ? undefined : ['PD-084'],
      });
    }
  }

  return { policyAsOf: au.asOf, pathways };
}
