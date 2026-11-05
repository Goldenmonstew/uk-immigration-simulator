# Phase 8 规划（2026-11-05）：Immigration Life 2.0——像素小镇

用户玩过 Phase 7 的卡牌版后反馈"很无聊，没有生活模拟器那种生动的感觉"，参照是模拟人生、星露谷物语、寒霜启示录（Whiteout Survival）。复盘：卡牌版节奏慢、事件被写成签证字段的变动、没有属性与积累、没有意外与连锁、结局没有故事。用户选了 **B：可走动的 2D 像素小镇（星露谷味）**，其余由 Fable 决定（§6）。本阶段把游戏重做成一个有世界、有属性、有压力、有日积月累的生活模拟，政策教学退到背景但数字仍全部来自引擎。

原则不变：一个 package 一个 writer（`packages/game` 仅 sol，`apps/web` 仅 astra，引擎不改）；事件的政策后果只由引擎算；虚构角色、不输入真实信息；真实的政策数字（签证费等）须登记来源；不过度工程化——但这次允许一个游戏库依赖（Phaser 3）与 CC0 素材。

## 1. 玩法设计

- **世界**：一个英国小镇的俯视像素地图（16×16 瓦片，约 32×22 格），玩家操控角色在街道上走动，走到建筑门口打开该地点的行动菜单。八个地点：家（休息：心情、健康；收信：事件）、公司（上班：钱、事业；加班：钱多心情少）、语言学校（上课：英语；考试：通过后写入 B1 / B2 证明）、GP 诊所（看病：健康）、酒吧与公园（放松：心情、人脉）、市政厅（看两栏定居评估——引擎的完整输出，含"为什么"）、签证中心（续签、换路线、申请定居——改时间线，收取真实费用）、火车站 / 机场（出国探亲或旅行——写入离境；也是"离开英国"结局的入口）。
- **时间**：以季为单位，10 年 = 40 季。每季玩家有 2 个行动点，走到地点消费；季中随机触发 1–2 个事件（弹出事件卡，带 2–3 个选择）；季末结算收入与开销、属性自然变化、签证倒计时，并用引擎重算两栏定居进度。地图随季节换色（春夏秋冬），一季大约 1 分钟，一局 10–15 分钟，可随时存档继续。
- **属性（0–100，钱以 £ 计）**：钱、心情、健康、英语、事业。上班涨钱与事业，升职提高年薪并写入时间线的 `salary`；英语到阈值后在语言学校考试才写入 `english` 证明；健康或心情见底触发连锁事件（住院、想回国）。季度收入 = 年薪 / 4 − 生活开销；这些是游戏参数（写在内容文件里并注明"游戏设定"），不是政策数字。
- **压力**：签证倒计时（当前片段的 `validTo`）常驻屏幕；到期前要去签证中心续签并付费（费用来自登记的来源）；过期未续签 → 逾期居留写入 `immigrationBreaches` → 引擎短路 → 结局。存款为负两季触发"借钱 / 搬去更便宜的地方"连锁；心情为 0 → "想回家"事件，可选离开英国（结局）。
- **事件系统**：事件带权重、季节、条件（属性区间、时间线状态、年份、已有旗标）、一次性标记、连锁（选项设置旗标，解锁后续事件）。公共事件库 120 条以上，每个角色 80 条以上（其中约一半只影响属性与叙事，不碰时间线）。风格指南：具体、有英国生活细节、轻松有幽默、不说教、不写"你应该"、中文一条不超过 60 字、英文同步；后果写在角色身上（"房东把押金扣了一半"），机制说明不超过一句且放在卡片底部小字。
- **政策教学**：顶部两条进度条"现行法律 / 改革后"——由引擎的 `earliestDate` 与当前日期换算成百分比，颜色随结论变；季末与关键事件后会动；点进市政厅看完整两栏与"为什么"。续签、换路线、申请定居这些动作直接改时间线，玩家在下一季末看到进度条的反应。
- **结局**：定居成功（任一栏 `LIKELY_ELIGIBLE` 时在签证中心"申请定居"）、离开英国、逾期或犯罪短路、十年到期未定居。结局页是一段按日志生成的"你的十年"叙事、两栏最终结果、成就（约 15 枚：五年零缺席、差一天、英语满分、十年老兵……）与"在模拟器里打开这条时间线"。不计分，有评语。

## 2. 技术决定（Fable）

- Phaser 3（`phaser@^3.90`，MIT）作为 `apps/web` 的依赖，只在 `/game` 路由按需加载（客户端组件 + `next/dynamic` `ssr: false`），不进其他页面；静态导出不变，部署流程不变。
- 游戏 UI 的文字层（属性条、进度条、事件卡、菜单、结局）用 React 覆盖在画布上，沿用站点 i18n；Phaser 只画地图、角色与季节效果。
- 素材：CC0 像素包，直接从 GitHub / OpenGameArt 取（kenney.nl 对脚本返回 403，不用）：`sparklinlabs/superpowers-asset-packs` 的 `ninja-adventure`（CC0；`background-elements/tileset.png`、`characters/*.png` 27 个带四向行走的角色、`hud/`、`fx/`、`musics/`）与 OpenGameArt "Zelda-like tilesets and sprites"（ArMM1998，CC0，`https://opengameart.org/sites/default/files/gfx_3.zip`）。放在 `apps/web/public/game/assets/`，附 `ATTRIBUTION.md`（来源 URL、作者、许可）。建筑用招牌 / 图标标识用途，不必追求"英国风"。
- 地图用 Tiled 的 JSON 格式手写或脚本生成（`apps/web/public/game/town.json`），碰撞层 + 建筑触发区。移动：键盘方向键 / WASD，手机点按格子走过去（网格 BFS），不做摇杆。
- 存档：`localStorage`（`uk-immigration-life-v2`，每角色一档）；语言切换只换文字。
- 不做：账号、排行榜、服务端、3D、自定义美术、音效以外的音乐制作（CC0 包里的音乐可选用，默认静音）。

## 3. 契约：`packages/game` v2 的 API（sol 实现，astra 依赖；以 `packages/game/src/types.ts` 为准）

```ts
type Text = { zhCN: string; en: string };
type StatKey = 'money' | 'mood' | 'health' | 'english' | 'career';
type LocationId = 'home' | 'work' | 'college' | 'gp' | 'pub' | 'council' | 'visa' | 'station';

interface Character { id; name: Text; intro: Text; sprite: string; startDate: IsoDate; timeline: PersonTimeline; stats: Record<StatKey, number>; events: GameEvent[]; achievements?: Achievement[] }
interface GameEvent { id; title: Text; text: Text; weight: number; season?: 1|2|3|4; once?: boolean; requires?: string[]; forbids?: string[]; when?: Condition[]; choices: Choice[] }
interface Choice { id; label: Text; effects: Effect[]; sets?: string[]; note?: Text }
type Condition = { stat: StatKey; min?: number; max?: number } | { yearMin?: number; yearMax?: number } | { route: Route } | { flag: string } | { visaMonthsLeftMax: number };
type Effect = { type: 'stat'; key: StatKey; delta: number } | { type: 'money'; delta: number } | 时间线效果（沿用 v1：absence / income / episode / newEpisode / benefit / relationship / english / lifeInTheUk / breach / criminal / timeline） | { type: 'ending'; ending: EndingId } | { type: 'none' };
interface LocationAction { id; location: LocationId; label: Text; cost?: number; effects: Effect[]; when?: Condition[] }  // 全局定义，角色可覆盖
interface GameState { version: 2; characterId; seed; locale; year: number; quarter: 1|2|3|4; date: IsoDate; timeline: PersonTimeline; stats: Record<StatKey, number>; actionsLeft: number; flags: string[]; firedEvents: string[]; pendingEvent?: string; log: LogEntry[]; result: SimulationResult; ending?: EndingId; achievements: string[] }
type LogEntry = { year; quarter; kind: 'action' | 'event' | 'quarter' | 'ending'; id; choiceId?; text: Text; statDeltas?: Partial<Record<StatKey, number>> };

newGame(characterId, seed, locale): GameState
actions(state): LocationAction[]                 // 当前可用的地点行动（按 when 过滤）
act(state, actionId): GameState                  // 消费 1 行动点，应用效果，可能触发事件（pendingEvent）
currentEvent(state): GameEvent | undefined
resolve(state, choiceId): GameState              // 结算事件选择
endQuarter(state): GameState                     // 行动点用完或主动结束：收入 / 开销、属性自然变化、季节推进、签证到期检查、抽下一季事件、引擎重算 result、年末成就
progress(state): Record<RuleSetId, { outcome; earliestDate?; percent: number }>  // 进度条
isOver(state): boolean
narrative(state): Text[]                         // 结局叙事：按 log 生成的句子
visaMonthsLeft(state): number
characters, locations, achievements
```

- 随机：mulberry32，同种子同序列；事件抽取按权重与条件，一次性事件不重复。
- 引擎只在 `endQuarter`、`act`（改了时间线时）与 `resolve`（改了时间线时）后重算，`result` 永远是当前时间线的两栏结果。
- 费用：签证中心的续签 / 定居申请费与 IHS 从 `packages/policy-data` 的参数读取（新参数文件条目，来源为 8.1 登记的 SRC-030 GOV.UK 费用页）；不在代码里写裸数字。

## 4. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 8.1 | `packages/game` v2：schema、纯逻辑（§3 全部 API）、地点行动表、风格指南、林遥的 40 条事件 + 公共 60 条（先把系统跑通）、结局叙事与成就框架、测试；登记 SRC-030 签证费用页并加费用参数 | sol | `packages/game`、`packages/policy-data/src/parameters/current-law-2026-11.ts`（费用参数）、`docs/SOURCES.md`、`policy-sources/` | 无 | 1 |
| 8.2 | Phaser 客户端骨架：素材与署名、地图、角色行走（键盘 + 点按寻路）、建筑触发、React 覆盖层（属性条、签证倒计时、进度条、事件卡、地点菜单、季末小结、结局页）、存档；8.1 未合并前用本地 mock 适配 §3 的契约 | astra | `apps/web`（`/game`、`public/game/`、依赖 `phaser`） | 无（契约见 §3） | 1 |
| 8.3 | 内容：陈嘉宁、索菲娅各 80 条事件、公共事件补到 120 条、连锁与成就、结局叙事模板；按 Fable 对 8.1 内容的评审修改 | sol | `packages/game` | 8.1 合并后 | 2 |
| 8.4 | 客户端整合与打磨：接真实 v2 API、删 mock 与旧卡牌页、季节视觉、年末小结、结局与成就、"在模拟器里打开"、可选音乐、手机布局与性能 | astra | `apps/web` | 8.1、8.2 合并后 | 2 |
| 8.5 | QA 与内容编辑：桌面与手机各角色整局；事件文案逐条过风格指南；进度条与市政厅两栏核对引擎 | Fable | — | 8.3、8.4 | 3 |
| 8.6 | 待定：更多角色（Global Talent、难民）、更多地点、结局分享图 | — | — | 用户反馈 | — |

## 5. 任务卡

见 `docs/tasks/8.1-game-core-v2.md`、`docs/tasks/8.2-game-client.md`；8.3、8.4 在 Wave 1 验收后写。

## 6. 决定（2026-11-05）

- 用户：选 B（可走动的 2D 像素小镇）；其余由 Fable 决定。
- Fable：美术用 CC0 素材包（ninja-adventure / Zelda-like），不定制；接受 Phaser 3 依赖，只在 `/game` 加载；游戏留在主站 `/game`，不拆 app；属性条与成就可以有，不计分；压力机制：签证到期倒计时与存款见底会触发连锁，逾期不续签直接结局；时间单位为季、10 年 40 季；地点八个。

## 7. 波次

- Wave 1（并行）：sol 8.1；astra 8.2（按 §3 契约用 mock 先做）。
- Wave 2：sol 8.3；astra 8.4（8.1 合并后接真实 API）。
- Wave 3：Fable 8.5；修改回各 writer。
- 进度（2026-11-05）：Wave 1、Wave 2 全部合并推送（8.1 2414750、8.2 ebb81d5、8.3 cbe1cb3、8.4 91556be）。8.5 已做：三角色桌面走查（续签、离境倒退、结局、刷新、英文）、375px、220 条新文案全文评审；评审修改派为 8.3b（sol）。8.6 待用户反馈。
