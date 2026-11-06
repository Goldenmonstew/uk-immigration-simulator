import { balance as b } from './balance';
import type { Item, Recipe, Quarter } from './types';

const crops: [string, string, string, Quarter[]][] = [
  ['potato', '土豆', 'Potato', [2]],
  ['strawberry', '草莓', 'Strawberry', [2]],
  ['tomato', '番茄', 'Tomato', [3]],
  ['cucumber', '黄瓜', 'Cucumber', [3]],
  ['turnip', '芜菁', 'Turnip', [1, 4]],
  ['corn', '甜玉米', 'Sweetcorn', [3]],
  ['sunflower', '向日葵', 'Sunflower', [3]],
  ['tulip', '郁金香', 'Tulip', [2]],
];
export const items: Item[] = [
  ...crops.flatMap(([id, zhCN, en, seasons]): Item[] => [
    {
      id,
      name: { zhCN, en },
      kind: 'crop',
      ...(!['sunflower', 'tulip'].includes(id) && {
        edible: { mood: b.food.cropMood, health: b.food.cropHealth },
      }),
    },
    {
      id: `seed-${id}`,
      name: { zhCN: `${zhCN}种子`, en: `${en} seeds` },
      kind: 'seed',
      price: b.prices.seed,
      grows: { crop: id, days: b.cropDays, seasons },
    },
  ]),
  ...[
    ['perch', '河鲈', 'Perch'],
    ['roach', '拟鲤', 'Roach'],
    ['carp', '鲤鱼', 'Carp'],
    ['tench', '丁鱥', 'Tench'],
    ['bream', '鳊鱼', 'Bream'],
    ['pike', '狗鱼', 'Pike'],
  ].map(([id, zhCN, en]): Item => ({
    id,
    name: { zhCN, en },
    kind: 'fish',
    edible: { health: b.food.fishHealth },
  })),
  { id: 'old-boot', name: { zhCN: '旧靴子', en: 'Old boot' }, kind: 'junk' },
  {
    id: 'shopping-trolley',
    name: { zhCN: '购物车', en: 'Shopping trolley' },
    kind: 'junk',
  },
  {
    id: 'tea',
    name: { zhCN: '茶', en: 'Tea' },
    kind: 'food',
    price: b.prices.tea,
    edible: { mood: b.food.teaMood },
  },
  {
    id: 'biscuits',
    name: { zhCN: '饼干', en: 'Biscuits' },
    kind: 'food',
    price: b.prices.biscuits,
    edible: { mood: b.food.biscuitsMood },
  },
  {
    id: 'flowers',
    name: { zhCN: '一束花', en: 'Flowers' },
    kind: 'gift',
    price: b.prices.flowers,
  },
  {
    id: 'cake',
    name: { zhCN: '蛋糕', en: 'Cake' },
    kind: 'food',
    price: b.prices.cake,
    edible: { mood: b.food.cakeMood },
  },
  {
    id: 'bonfire-toffee',
    name: { zhCN: '篝火太妃糖', en: 'Bonfire toffee' },
    kind: 'food',
    price: b.prices.festival,
    edible: { mood: b.food.cakeMood },
  },
  ...[
    ['dumplings', '百家宴饺子', 'Potluck dumplings'],
    ['may-bun', '五月节甜面包', 'May Day bun'],
    ['summer-corn', '烤甜玉米', 'Grilled sweetcorn'],
    ['gingerbread', '姜饼人', 'Gingerbread person'],
  ].map(([id, zhCN, en]): Item => ({
    id,
    name: { zhCN, en },
    kind: 'food',
    price: b.prices.festival,
    edible: { mood: b.food.mealMood, health: b.food.cropHealth },
  })),
  ...[
    ['baked-potato', '烤土豆', 'Baked potato'],
    ['salad', '田园沙拉', 'Garden salad'],
    ['fish-and-potatoes', '鱼配土豆', 'Fish and potatoes'],
    ['strawberry-jam', '草莓酱', 'Strawberry jam'],
    ['turnip-soup', '芜菁汤', 'Turnip soup'],
    ['corn-soup', '玉米浓汤', 'Sweetcorn soup'],
  ].map(([id, zhCN, en]): Item => ({
    id,
    name: { zhCN, en },
    kind: 'food',
    edible: { mood: b.food.mealMood, health: b.food.mealHealth },
  })),
];
export const recipes: Recipe[] = [
  {
    id: 'dumplings',
    label: { zhCN: '包蔬菜饺子', en: 'Make vegetable dumplings' },
    needs: { turnip: 1, potato: 1 },
    makes: 'dumplings',
    minutes: b.recipeMinutes,
  },
  {
    id: 'summer-corn',
    label: { zhCN: '烤甜玉米', en: 'Grill sweetcorn' },
    needs: { corn: 1 },
    makes: 'summer-corn',
    minutes: b.recipeMinutes,
  },
  {
    id: 'turnip-soup',
    label: { zhCN: '煮芜菁汤', en: 'Make turnip soup' },
    needs: { turnip: 2 },
    makes: 'turnip-soup',
    minutes: b.recipeMinutes,
  },
  {
    id: 'corn-soup',
    label: { zhCN: '煮玉米浓汤', en: 'Make sweetcorn soup' },
    needs: { corn: 1, potato: 1 },
    makes: 'corn-soup',
    minutes: b.recipeMinutes,
  },
  {
    id: 'baked-potato',
    label: { zhCN: '烤土豆', en: 'Bake a potato' },
    needs: { potato: 1 },
    makes: 'baked-potato',
    minutes: b.recipeMinutes,
  },
  {
    id: 'salad',
    label: { zhCN: '拌沙拉', en: 'Make a salad' },
    needs: { tomato: 1, cucumber: 1 },
    makes: 'salad',
    minutes: b.recipeMinutes,
  },
  {
    id: 'fish-and-potatoes',
    label: { zhCN: '鱼配土豆', en: 'Cook fish and potatoes' },
    needs: { perch: 1, potato: 1 },
    makes: 'fish-and-potatoes',
    minutes: b.recipeMinutes,
  },
  {
    id: 'strawberry-jam',
    label: { zhCN: '熬草莓酱', en: 'Make strawberry jam' },
    needs: { strawberry: 2 },
    makes: 'strawberry-jam',
    minutes: b.recipeMinutes,
  },
];
