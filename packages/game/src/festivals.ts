import type { Festival } from './types';

export const festivals: Festival[] = [
  {
    id: 'lunar-new-year',
    season: 1,
    name: { zhCN: '春节聚会', en: 'Lunar New Year gathering' },
    text: {
      zhCN: '社区百家宴，保温盒摆满了长桌。',
      en: 'Covered dishes fill the long table at the community potluck.',
    },
  },
  {
    id: 'may-day',
    season: 2,
    name: { zhCN: '五月节集市', en: 'May Day fair' },
    text: {
      zhCN: '彩带绕过摊位，风先替大家跳起了舞。',
      en: 'Ribbons weave between stalls; the wind starts dancing first.',
    },
  },
  {
    id: 'summer-fair',
    season: 3,
    name: { zhCN: '夏日集市', en: 'Summer fair' },
    text: {
      zhCN: '菜地评比开场，黄瓜比参赛者更紧张。',
      en: 'The allotment show opens; the cucumbers look more nervous than their growers.',
    },
  },
  {
    id: 'bonfire-night',
    season: 4,
    name: { zhCN: '篝火之夜', en: 'Bonfire Night' },
    text: {
      zhCN: '绿地上架起篝火，纸杯热气里混着太妃糖的甜味。',
      en: 'A bonfire rises on the green. Steam from paper cups mingles with the sweetness of toffee.',
    },
  },
  {
    id: 'christmas-market',
    season: 4,
    name: { zhCN: '圣诞集市', en: 'Christmas market' },
    text: {
      zhCN: '小灯泡亮了，摊主开始抢救被风吹跑的包装纸。',
      en: 'Little lights come on as stallholders rescue wrapping paper from the wind.',
    },
  },
];
