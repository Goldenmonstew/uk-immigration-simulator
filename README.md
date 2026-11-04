# UK Immigration Simulator

英国移民政策互动模拟器。目前只有仓库脚手架，不包含政策规则、数据表或问卷。

使用 Node.js 26（见 `.nvmrc`）和 pnpm 10.34.4（见 `package.json`）。

## 目录结构

```text
apps/web/              Next.js App Router 应用，静态导出占位首页
packages/engine/       纯 TypeScript 规则引擎，目前只导出版本与占位函数
packages/policy-data/  政策参数、schema 与 fixtures 的存放位置，目前只有占位导出
docs/                 项目设计、来源登记与任务报告
policy-sources/       官方来源文件快照
```

两个内部 package 直接导出 TypeScript 源码，供 workspace 消费；各自执行 `build` 时通过 `tsc` 生成 `dist/`。

## 常用命令

在仓库根目录执行：

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

`build`、`typecheck`、`test` 按 workspace 顺序串行执行。`format` 跳过既有项目文档、来源快照与生成文件。

Web 的 `typecheck` 先执行 `next typegen` 生成 Next.js 类型，因此首次 checkout 无需先 build；`next-env.d.ts` 由 Next.js 生成，不纳入版本控制。

只操作一个 package：

```bash
pnpm --filter @uk-immigration/engine test
pnpm --filter @uk-immigration/policy-data build
pnpm --filter web dev
pnpm --filter web build
```

Web 首页显示 workspace 引擎版本；静态导出入口为 `apps/web/out/index.html`。CI 在 push 和 pull request 时依次执行安装、lint、typecheck、test、build。
