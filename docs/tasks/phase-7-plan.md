# Phase 7 规划（2026-11-05）

Phase 6 之后，两栏覆盖用户常见路线的主申请人与主要 dependant，差距摘要只列结论依据，问卷有储蓄与福利输入。Phase 7 的主题是**原始方案的第三个模块 Immigration Life——用虚构角色玩的教学游戏，以及全站移动端适配**。玩法已与用户讨论定案（§4）。分工：sol 建 `packages/game`（内容 + 纯逻辑 + 测试），astra 做 `/game` 页面与移动端适配；引擎不改，不需要 Opus 任务。候选来源：`docs/00-project-analysis-and-plan.md` §2（Immigration Life 排在第四阶段）、用户 2026-11-05 的决定。

原则不变：一个 package 一个 writer；每个事件卡的后果只由引擎算出，游戏不写规则；虚构角色、虚构事件，游戏里不输入真实信息；不过度工程化（无账号、无排行榜、无动画库、无新外部依赖）；合并后自动 push 触发 CI 与部署。

## 1. 任务总览

| # | 任务 | 负责 | 改动范围 | 依赖 | 波次 |
|---|---|---|---|---|---|
| 7.1 | `packages/game`：脚手架、内容 schema、纯逻辑（开局、抽运气牌、结算选择、推进回合、变化规则）、角色一 Skilled Worker 的脚本与公共运气牌池、测试 | sol | `packages/game`（新）、根 `pnpm-workspace.yaml` 如需 | 无 | 1 |
| 7.2 | 全站移动端适配：375 / 390 / 414 宽度审计并修（header 与导航、表单控件、结果两栏、/policy 表格、What-if 控件）；顺手删 header 的 "My Immigration Path" 副标题 | astra | `apps/web` | 无 | 1 |
| 7.3 | 角色二 HK BN(O)、角色三英国公民的伴侣：脚本、专属运气牌、测试；按 Fable 的内容评审修改角色一 | sol | `packages/game` | 7.1 合并后 | 2 |
| 7.4 | `/game` 页面：角色选择、回合卡片、运气牌揭示、两栏并排结果与变化高亮、结局页、"在模拟器里打开这条时间线"、再玩一次 / 换角色；首页"玩一局"入口；进度存本机；中英；移动优先 | astra | `apps/web` | 7.1、7.2 合并后 | 2 |
| 7.5 | 内容评审与走查：语气、事件合理性、每张卡的后果是否真的由引擎体现；桌面与 375 走查 | Fable | — | 7.3、7.4 | 3 |
| 7.6 | 待定：更多角色（Global Talent、难民）、结局分享图；按用户反馈 | — | — | 用户决定 | — |

## 2. 任务卡

### 7.1 `packages/game`（sol）

- 脚手架照 `packages/policy-data` 的最小配置复制（`package.json` 的 build / test / lint / typecheck、`tsconfig`、vitest；eslint 用根配置）；workspace 依赖只有 `@uk-immigration/engine` 与 `@uk-immigration/policy-data`；零外部依赖；伪随机用自写 mulberry32（可从 `packages/engine/test/random.test.ts` 搬）。
- 内容 schema（`src/types.ts`）：
  - `Character`：`id`、`name` / `intro`（`{ zhCN; en }`）、`startDate`（第一回合的模拟日期）、`timeline: PersonTimeline`（起始时间线，含到开始日为止的片段）、`script: ChoiceCard[]`（按回合一张）、`luckPool: LuckCard[]`（角色专属，与公共池合并）。
  - `Card`：`id`、`kind: 'choice' | 'luck'`、`title` / `text`（双语）、`choices: Choice[]`；运气牌只有一个选择（"知道了"）。
  - `Choice`：`id`、`label`（双语）、`effects: Effect[]`、`note?`（双语，一句"这张卡在规则里对应什么"，不写结论）。
  - `Effect` 是闭合枚举，只用引擎读取的字段：`absence`（自当前日期的偏移与天数）、`income`（当前 / 下一 tax year 的 `earnings` / `partnerEarnings`）、`episode`（修改当前片段，如 `salary`、`socCode`、`validTo`）、`newEpisode`（自当前日期起新片段并截断上一片段：换路线、续签、转 dependant）、`benefit`、`relationship`（增 / 删）、`english`、`lifeInTheUk`、`breach`、`criminal`、`timeline`（`cashSavings` / `partnerSpecifiedBenefit` / `governmentDebt`）、`none`（纯叙事）。
- 回合：`turnMonths = 12`，10 回合。每回合先按种子以 `luckChance = 0.5` 决定是否抽一张运气牌（从公共池 + 角色池里按种子抽，不重复），再出脚本选择卡；每张卡结算后立刻用 `evaluate({ simulationDate, timeline, locale })` 算两栏（只评估主申请人，不传 `principal`），记录 before / after；回合结束推进 12 个月。任一栏短路或 10 回合结束 → 结局。
- 纯逻辑（`src/game.ts`，无 React、无 IO）：`startGame(characterId, seed)`、`currentCard(state)`、`choose(state, choiceId)`、`advance(state)`、`isOver(state)`、`changedRules(before, after)`（状态变化的规则 ID，供 UI 高亮与结局统计）。`GameState` 可 JSON 序列化（web 存 localStorage）。
- 公共运气牌池至少 8 张，好、坏、中性都有，例如：父母病重回国 4 个月（absence）；公司加薪 10%（income）；房东涨租（none）；在英国住院 6 周（none，教"在英国生病不算离境"）；意外退税（none）；伴侣找到工作（partnerEarnings）；护照续签延误（none）；收到交通罚单（none，解释里说明民事罚款不是犯罪记录、引擎未建模的边界）。
- 角色一 Skilled Worker（姓名、国籍虚构）：10 张选择卡的梗概由 sol 按引擎字段写，Fable 评审。候选事件：外派 8 个月 vs 留下；跳槽到 £55,000 但岗位变；伴侣来英（只影响关系与伴侣收入，游戏不评估 dependant）；伴侣失业后申领 Universal Credit vs 借钱；2027-03-26 前考 B2 vs 等；担保方裁员后 60 天内找到新担保 vs 回国；一次酒驾（犯罪记录 → 短路，结局提前）；买房（none）。每张卡先确认引擎确实读取所用字段，不确定的不写。
- 文案：zh-CN / en；轻松不戏谑；不对任何群体做刻板印象；不写"你应该……"。
- 测试：每张卡的每个选择在该回合基线上应用后 `evaluate` 不抛错、结论属六态；10 个种子整局跑通且同种子同结果；`changedRules` 对已知卡给出预期规则（如外派 8 个月 → 现行法律栏的居留规则状态变化）。
- 验收：gate（新 package 进 `pnpm -r`）；Fable 读全部卡文案；两个种子手跑。

### 7.2 全站移动端适配（astra）

- 用内置浏览器 375 / 390 / 414 三档审计全部页面（首页、问卷各步、结果、What-if、/policy、/about），先列问题清单（写进报告）再修：header（站名与导航在窄屏分两行、触控区至少 44px；删掉 `site.englishName` 副标题及其 CSS）；表单（控件撑满、输入字号至少 16px 以免 iOS 自动缩放、"下一步"按钮位置稳定）；结果页两栏在窄屏下的阅读顺序（堆叠、栏间锚点或切换、差距摘要优先）；/policy 的表格放横向滚动容器；What-if 控件；分享与打印不受影响。
- 不加依赖，不重做视觉；中英；按需要补测试。
- 验收：Fable 375 与 390 全页走查并截图；桌面无回归。

### 7.3 角色二、三（sol，7.1 合并后）

- HK BN(O) 主申请人（改革栏"不在框架内"本身是教学点：B2 与犯罪要求仍适用）；英国公民的伴侣（5 年路线：收入缺口与储蓄、伴侣失业、过渡门槛、2027 年的 B2、第 5 年同时申请子女定居只作叙事）。各 10 张选择卡与专属运气牌；测试同 7.1；按 Fable 对角色一的评审意见统一修改。

### 7.4 `/game` 页面（astra，7.1 与 7.2 合并后）

- 流程：角色选择 → 每回合（运气牌揭示 → 选择卡 → 两栏并排：结论、年限、最早日期，状态变化的规则高亮并可展开解释与来源，复用 `AssessmentColumns` 或其精简版 → 下一回合）→ 结局页（两栏最终结果、变化最多的三条规则、"在模拟器里打开这条时间线"用 `encodeDraft` 生成 `/result` 链接、再玩一次换种子 / 换角色）。
- 首页"玩一局"按钮；`/game` 静态导出；进度存 `uk-immigration-game-v1`；页首固定提示"教学游戏，角色与事件虚构，不是建议"；中英；移动优先；零新依赖。
- 不做：分数、排行榜、账号、动画库、服务端。
- 验收：Fable 两个角色各玩一局（桌面 + 375），英文模式，刷新后进度仍在。

### 7.5 内容评审与走查（Fable）

- 读全部卡文案：语气、虚构性、每张卡的 `note` 是否与引擎实际结果一致；抽卡验证"后果来自引擎"（改一张卡的效果，结果随之变）。

## 3. 验收总则

同 Phase 6：gate 全过；新 package 有测试；UI 改动 Fable 浏览器走查（桌面、375、英文）；一个逻辑改动一次 commit；合并后 push main 自动部署。游戏内容的政策准确性由引擎保证，Fable 只评审叙事与边界说明。

## 4. 用户决定（2026-11-05）

1. 形式：卡牌式决策。
2. 角色：Skilled Worker、HK BN(O)、英国公民的伴侣三个都做。
3. 随机性：加运气牌增加重玩。
4. 规则世界：每一步两栏并排显示。
5. 不计分。
6. 语气：轻松但不戏谑，角色与事件虚构，避免群体刻板印象。
7. 入口：首页"玩一局"按钮，游戏放在 `/game`。
8. 整体页面增加移动端适配（7.2）。

## 5. 波次

- Wave 1（并行）：sol 7.1；astra 7.2。
- Wave 2：sol 7.3（7.1 合并后）；astra 7.4（7.1、7.2 合并后）。
- Wave 3：Fable 7.5；评审出的修改各回原 writer，小任务。
- writer 互不碰同一 package：sol 只改 `packages/game`（及必要的 workspace 配置），astra 只改 `apps/web`。

## 7. 完成状态（2026-11-05）

7.1–7.4 全部验收合并到 main（PROGRESS 第 88–94 行，报告见 `docs/tasks/reports/7.*.md`），7.5 由 Fable 完成（读全部卡文案；三个角色各两个种子的引擎整局；main 构建上用浏览器驱动真实按钮玩满一局并核对结局、分享链接、刷新恢复、英文、375px）；7.6 待用户反馈。

- `packages/game`：schema、纯逻辑（结局只在两栏都停的短路时触发；推进年份时按当前年薪延续收入）、8 张公共运气牌、三个角色（林遥 Skilled Worker、陈嘉宁 HK BN(O)、索菲娅·莫拉英国公民的伴侣）各 10 张选择卡与专属运气牌，122 项测试。
- `/game`：角色选择、卡片与选项说明、两栏并排与变化高亮（含推进年份）、结局页与分享到模拟器、进度存本机、中英、首页入口。
- 全站移动端适配：header 221 → 102px，结果页与 /policy 高度大减并可折叠跳转，字号与路线短名调整。
- 分工：sol 做了 7.1、7.3，astra 做了 7.2、7.4；Opus 未参与。gate 末态 policy-data 21、engine 2577、game 122、web 238。

留给下一阶段的候选：更多角色（Global Talent、难民）与结局分享图（7.6）；游戏内"这一年过去了"的变化说明可写成一句叙事（现在只列规则）；运气牌只有 8 张公共 + 每角色 3 张，重玩几局后会重复；结局页"在模拟器里打开"后的 What-if 可预填游戏时间线；`docs/review/wording-2026-11.md` 不含游戏文案，若要审游戏文案可另做导出；Opus 会话 engine-6-2 分支上未合并的文案导出 commit（12650d0）可归档。
