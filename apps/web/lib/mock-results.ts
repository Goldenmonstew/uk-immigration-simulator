import type { SimulationResult } from '@uk-immigration/engine';
import { earnedSettlement2026_11 as es } from '../../../packages/policy-data/src';
import { policyAsOf } from './policy';

export const mockResults: Record<'1' | '2', SimulationResult> = {
  '1': {
    policyAsOf,
    byRuleSet: {
      'current-law-2026-11': {
        outcome: 'LIKELY_ELIGIBLE',
        rules: [
          {
            id: 'MOCK-CL-RESIDENCE',
            title: '合资格居留',
            status: 'PASS',
            explanation: '虚构示例：输入的居留记录满足此项要求。',
            sources: [{ srcId: 'SRC-004', locator: 'SW 21.1–SW 21.2' }],
          },
          {
            id: 'MOCK-CL-LIFE',
            title: 'Life in the UK',
            status: 'PASS',
            explanation: '虚构示例：已提供通过考试的记录。',
            sources: [{ srcId: 'SRC-015', locator: 'KOL 2.1' }],
          },
        ],
        assumptions: ['仅用于开发预览；这些规则结果是手写示例。'],
      },
      'earned-settlement-2026-11': {
        outcome: 'LIKELY_ELIGIBLE',
        pathwayYears: es.values.pathwayYears5.value,
        earliestDate: policyAsOf,
        rules: [
          {
            id: 'MOCK-ES-EARNINGS',
            title: '收入历史',
            status: 'PASS',
            explanation: '虚构示例：收入历史满足该示例路径的计数要求。',
            sources: [{ srcId: 'SRC-001', locator: 'p16' }],
          },
          {
            id: 'MOCK-ES-RESIDENCE',
            title: '居留路线',
            status: 'PASS',
            explanation: '虚构示例：记录中的许可属于可计入的路线。',
            sources: [{ srcId: 'SRC-001', locator: 'p23' }],
          },
        ],
        assumptions: [
          '假设已公布改革在模拟日期适用。',
          '日期仅为展示格式的虚构示例，不是引擎推算。',
        ],
      },
    },
  },
  '2': {
    policyAsOf,
    byRuleSet: {
      'current-law-2026-11': {
        outcome: 'LIKELY_NOT_ELIGIBLE',
        rules: [
          {
            id: 'MOCK-CL-RESIDENCE',
            title: '合资格居留',
            status: 'FAIL',
            explanation: '虚构示例：提供的居留期间不足。',
            sources: [{ srcId: 'SRC-004', locator: 'SW 21.1' }],
          },
          {
            id: 'MOCK-CL-SALARY',
            title: '受担保薪资',
            status: 'UNKNOWN',
            explanation: '虚构示例：尚未填写受担保薪资，无法评估此项。',
            sources: [{ srcId: 'SRC-004', locator: 'SW 24.3' }],
          },
        ],
        assumptions: [
          '仅用于开发预览；补充薪资信息不会改变此示例中的居留缺口。',
        ],
      },
      'earned-settlement-2026-11': {
        outcome: 'LIKELY_NOT_ELIGIBLE',
        rules: [
          {
            id: 'MOCK-ES-RESIDENCE',
            title: '合资格居留',
            status: 'FAIL',
            explanation: '虚构示例：提供的居留期间不足。',
            sources: [{ srcId: 'SRC-001', locator: 'p46' }],
          },
          {
            id: 'MOCK-ES-FUNDS',
            title: 'Specified public funds',
            status: 'UNKNOWN',
            explanation: '虚构示例：政府尚未确定最终纳入范围与豁免（PD-013）。',
            sources: [{ srcId: 'SRC-001', locator: 'p18' }],
          },
        ],
        assumptions: [
          '假设已公布改革在模拟日期适用；尚未公布的细节保留为未知。',
        ],
      },
    },
  },
};
