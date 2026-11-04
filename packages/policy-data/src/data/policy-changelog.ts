import type { SourceRef } from '../types';

export interface PolicyChange {
  /** YYYY-MM-DD */
  date: string;
  title: string;
  /** One or two sentences in Chinese, retaining English legal terms. */
  summary: string;
  /** English translation of `title`; every entry has one. */
  titleEn?: string;
  /** English translation of `summary`; every entry has one. */
  summaryEn?: string;
  sources: SourceRef[];
}

export const policyChangelog: PolicyChange[] = [
  {
    date: '2025-05-12',
    title:
      'White Paper CP 1326 "Restoring control over the immigration system"：提出定居基准期 10 年与定居英语 B2；发布日成为 Earned Settlement 过渡安排的截止点',
    summary:
      '提出将 settlement 标准合格期提高到 10 年，并将定居英语要求提高到 B2。CP 1707 的相关过渡安排以 White Paper 的发布日作为截止点。',
    sources: [
      { srcId: 'SRC-012', locator: '¶257' },
      { srcId: 'SRC-012', locator: '¶264' },
      { srcId: 'SRC-001', locator: 'p42' },
    ],
  },
  {
    date: '2025-11-20',
    title: 'CP 1448 "A Fairer Pathway to Settlement" 咨询（至 2026-02-13）',
    summary:
      '发布 Earned Settlement 咨询文件 CP 1448，咨询期为 2025-11-20 至 2026-02-13。',
    sources: [{ srcId: 'SRC-013', locator: 'cover' }],
  },
  {
    date: '2026-03-05',
    title: 'Statement of Changes HC 1691：2027-03-26 起多条路线定居英语升至 B2',
    summary:
      'HC 1691 提交议会，规定自 2027-03-26 起提交的 settlement 申请在多条路线须满足 CEFR B2 英语要求，适用路线包括 Skilled Worker 与 Long Residence，并保留相应豁免。',
    sources: [
      { srcId: 'SRC-007', locator: 'EM 5.60–5.62' },
      { srcId: 'SRC-004', locator: 'SW 22A.1' },
      { srcId: 'SRC-005', locator: 'LR 13.1' },
    ],
  },
  {
    date: '2026-10-08',
    title:
      'Statement of Changes HC 584：Appendix Skilled Worker / Long Residence 当前快照版本',
    summary:
      '登记 Appendix Skilled Worker 与 Appendix Long Residence 的 2026-10-08 版本快照，两者的该次变更记录均对应 Statement of Changes HC 584。',
    sources: [
      { srcId: 'SRC-004', locator: '版本 2026-10-08' },
      { srcId: 'SRC-005', locator: '版本 2026-10-08' },
    ],
  },
  {
    date: '2026-11-02',
    title:
      'CP 1707 政府回应：Earned Settlement 最终框架（3 / 5 / 10 / 20 年路径、强制要求、过渡安排）；两院陈述给出实施时间表',
    summary:
      '政府回应公布 Earned Settlement 的 3 / 5 / 10 / 20 年路径、强制要求和过渡安排。两院同日陈述后的问答给出分阶段实施时间表。',
    sources: [
      { srcId: 'SRC-001', locator: 'p46' },
      { srcId: 'SRC-002', locator: 'col 593' },
      { srcId: 'SRC-003', locator: 'cols 1423–1424' },
    ],
  },
];
