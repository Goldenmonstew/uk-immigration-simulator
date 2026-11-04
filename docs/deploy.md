# Cloudflare Pages 部署

本项目把 Next.js 静态导出目录 `apps/web/out` 直接上传到 Cloudflare Pages。本机直传无需 GitHub；之后也可由 GitHub Actions 上传到同一个 Direct Upload 项目。

## 1. 准备账号与本机环境

- 安装 `.nvmrc` 指定的 Node.js 26，以及根 `package.json` 指定的 pnpm 10.34.4。
- 登录 Cloudflare，选择承载 Pages 项目和已有域名的账号。
- 在 Cloudflare 的 API Tokens 页面选择 **Create Token → Custom Token → Get started**。权限选 **Account → Cloudflare Pages → Edit**，Account Resources 限定为该账号，然后创建并保存 token。
- 打开该账号下已有域名的 **Overview**，在右侧 **API** 区域复制 **Account ID**。

官方步骤：[Use Direct Upload with continuous integration](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/#get-credentials-from-cloudflare)。

## 2. 创建 Direct Upload 项目并首次部署

建议项目名为 `uk-immigration-simulator`。下面用 Wrangler 创建空的 **Direct Upload** 项目，并将 production branch 设为 `main`。项目名若不可用，替换为自己的名称；项目已创建时跳过 `pages project create` 那一行。

在已合并交付内容的本地仓库 `main` 分支执行以下命令。Wrangler 会自动读取当前 Git 分支；从任务分支上传会生成该分支的预览部署，因此首次检查 `https://<项目名>.pages.dev` 时应使用 `main`。

下面命令使用 Bash；macOS 默认使用 zsh 时可先执行 `bash`。将第一行路径换成本地仓库路径，按提示输入 Account ID 与 token；token 输入不回显，也不写入命令历史或仓库文件。

```bash
cd /path/to/web-UK
git branch --show-current # Must print main
pnpm install --frozen-lockfile

export CF_PAGES_PROJECT=uk-immigration-simulator
read -rp 'Cloudflare Account ID: ' CLOUDFLARE_ACCOUNT_ID
export CLOUDFLARE_ACCOUNT_ID
read -rsp 'Cloudflare API token: ' CLOUDFLARE_API_TOKEN
printf '\n'
export CLOUDFLARE_API_TOKEN

pnpm dlx wrangler@4.157.0 pages project create "$CF_PAGES_PROJECT" --production-branch main
pnpm deploy:pages

unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID
```

`deploy:pages` 会先运行 `pnpm build`，再用固定版本 `wrangler@4.157.0` 上传 `apps/web/out`。此版本由 2026-11-04 的 `npm view wrangler version` 查询确定，不添加项目依赖。Wrangler 自行读取 `CLOUDFLARE_ACCOUNT_ID` 与 `CLOUDFLARE_API_TOKEN`；项目名未设置或为空时，构建后会明确报错 `CF_PAGES_PROJECT: set CF_PAGES_PROJECT` 并退出。

部署成功后，打开 `https://<项目名>.pages.dev`（例如 `https://uk-immigration-simulator.pages.dev`），以控制台给出的实际地址为准。Fable 再用浏览器检查首页、`/simulate`、`/result`，并直接打开、刷新这些 clean URL。

官方说明：[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/#wrangler-cli)、[Wrangler Pages 命令](https://developers.cloudflare.com/workers/wrangler/commands/pages/#pages-project-create)。此类项目之后仍通过 Wrangler 上传；GitHub Actions 采用下节工作流，无需切换 Cloudflare 内置 Git integration。

## 3. GitHub 远端就绪后自动部署

用户建好 GitHub 仓库、推送 `main` 后，在仓库 **Settings → Secrets and variables → Actions** 配置：

| 位置 | 名称 | 内容 |
|---|---|---|
| Secrets → New repository secret | `CLOUDFLARE_API_TOKEN` | 上面创建的 Pages 编辑 token |
| Secrets → New repository secret | `CLOUDFLARE_ACCOUNT_ID` | 同一个 Cloudflare 账号的 Account ID |
| Variables → New repository variable | `CF_PAGES_PROJECT` | 已创建的 Pages 项目名，例如 `uk-immigration-simulator` |

配置好之后再次 push `main`，`.github/workflows/deploy.yml` 会安装锁文件依赖并执行 `pnpm deploy:pages`。在 GitHub **Actions → Deploy to Cloudflare Pages** 查看运行结果，再打开 `https://<项目名>.pages.dev` 确认更新。

## 4. clean URL、尾斜杠与缓存

Cloudflare Pages 的 [Serving Pages：Route matching](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching) 说明，匹配的 HTML 文件会直接服务于对应路径，显式 `.html` URL 会重定向到省略扩展名的 URL。因此本项目的 `out/simulate.html` 对应 `/simulate`，访问 `/simulate.html` 会重定向到 `/simulate`。

尾斜杠随文件布局区分：`simulate.html` 的规范 URL 是 `/simulate`；目录形式 `simulate/index.html` 的规范 URL 则是 `/simulate/`（文档中的例子为 `/about/index.html` → `/about/`）。按这一规则推得，本项目使用不带尾斜杠的路径，预期 `/simulate/` 也归一到 `/simulate`；首次真实部署时需用浏览器实际响应确认上述重定向。

`_next/static` 无需新增 `apps/web/public/_headers`：采用 Pages 默认 CDN 缓存与浏览器 ETag 重验证即可，本次没有额外的长期浏览器缓存需求。依据：[Serving Pages：Caching and performance](https://developers.cloudflare.com/pages/configuration/serving-pages/#caching-and-performance)（官方建议通常保留默认缓存，避免自定义域名上的缓存规则导致旧资源残留）。

## 5. 绑定已有 Cloudflare 域名

**绑定正式域名前，请先由用户安排 IAA 注册顾问复核结果页措辞。** 这是项目 [Phase 2 规划 §4 第 2 条](tasks/phase-2-plan.md#4-待用户决定) 的上线要求；`*.pages.dev` 预览可先用于验收。

复核完成后：

1. 在 Cloudflare **Workers & Pages** 打开该 Pages 项目。
2. 进入 **Custom domains → Set up a domain**。
3. 输入要绑定的根域名或子域名，选择 **Continue**。根域名须位于同一 Cloudflare 账号，且 nameservers 已指向 Cloudflare。
4. 按页面提示确认 DNS 记录；域名已由 Cloudflare 托管时，确认后会自动添加所需 CNAME。先在 Pages 关联域名，再确认 DNS。
5. 等待 Custom domains 中域名状态与 HTTPS 证书就绪，打开 `https://<自定义域名>`，检查首页、`/simulate`、`/result` 和页面刷新。

官方步骤：[Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/#add-a-custom-domain)。
