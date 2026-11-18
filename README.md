# tpl-vue2-admin-ele-vea

基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 改造的 Vue 2 + Element UI 后台模板。模板本身是独立应用，不作为 hel 远程组件包对外暴露；页面使用的公共组件由 `comps-vue2`、`comps-vue2-ele`（think-vuele 的 Tc* 组件库与 TierRanking）和 `comps-vue2-ele-vea`（vue-element-admin 来源的页面级组件与 Excel 导出工具）远程加载。

## 开发

开发默认 localhost，需同时启动提供方；生产构建默认 SFTP。仅开发模板业务时，可设置 `REMOTE_TARGET=sftp` 使用托管组件：

```bash
pnpm install
pnpm dev
pnpm build
```

修改组件提供方时显式设置 `REMOTE_TARGET=local`，并分别启动 `comps-vue2`（20040）、`comps-vue2-ele`（20010）与 `comps-vue2-ele-vea`（20011）。可通过对应 `VUE_APP_*_HOST` 覆盖地址。新增代理具名导出需先发布提供方 npm 版本；静态托管实现与 npm 代理是两份交付。

入口为 `main.js → preloadHelLibs → import('./loadApp') → 业务应用`。启动时准备三个组件包，显式开启公共 loading；`loadApp` 完成插件与权限初始化，等待首次异步路由准备后挂载。失败显示可见提示，公共遮罩自动清理。

业务直接具名导入，无需解构默认代理或本地 remote 转发：

```js
import { HelloWorld } from '@melt-js/comps-vue2'
import { TierRanking } from '@melt-js/comps-vue2-ele'
import { AdminChart, Pagination } from '@melt-js/comps-vue2-ele-vea'
```

原默认入口仍兼容；组件的真实实现来自托管提供方。构建输出为 `dist/`，npm tarball 目前只交付静态页；独立源码模板交付还需源码、配置和包内环境文件，以及实际已发布的依赖版本。


## vue-element-admin 增强版

参考 PanJiaChen/vue-element-admin 的 4.4.0 源码，固定提交 `6858a9ad67483025f6a9432a926beb9327037be3`（2026-11-15 下载）。原始 MIT 许可保留在本包 LICENSE；移植组件（现已独立为 `@melt-js/comps-vue2-ele-vea`）的 MIT 许可见 `../comps-vue2-ele-vea/src/components/admin-LICENSE.txt`。

- 多页签：首页固定、切换、关闭、中键关闭、右键刷新、关闭其他/左侧/右侧/全部；横向滚动与当前页签定位。
- 缓存：路由 `name` 必须和页面组件 `name` 一致；按 `path` 识别页签，query 更新同一页签的目标地址。`meta.affix` 固定页签，`meta.noCache` 禁用页面缓存，`meta.noTab` 排除页签。关闭会移除页面缓存；刷新通过 redirect 路由重新创建目标页面。退出登录清空页签。浏览器整页刷新会重置内存草稿和页签。
- 表格：动态列、拖拽排序、行内编辑、综合查询/分页/创建/修改/删除/导出。
- 组件：吸顶与返回顶部、拖拽多选、双列表拖拽、看板、数字动画、JSON 校验格式化。
- 图表：折线、柱状、混合、环形；共享 AdminChart 处理容器尺寸变化和销毁。
- 数据工具：普通/选中行/合并表头 Excel 导出、Excel/CSV 导入、剪贴板、Zip 导出、页内 Tab 缓存。
- 综合表单：校验、加载文章、保存草稿、发布和预览；独立缓存验证页面可检查未提交输入。

文章 API 位于 `mock/article.js`，开发服务和生产 MockXHR 共用。新增、编辑、删除保留在各自演示会话内，不写外部服务；重启开发服务或刷新生产页会恢复演示数据。部署为真实业务前替换演示 API。

vue-element-admin 来源的通用组件和 Excel 导出在 `@melt-js/comps-vue2-ele-vea`（与 think-vuele 组件库分开发布与托管），模板负责页面、路由、状态、API 与业务编排。未迁入依赖外部编辑器 CDN、云上传凭据的旧示例；当前 JSON 示例使用文本编辑和标准 JSON 校验。

### 本地联调这次新增组件

新增具名代理和远程实现需要一起发布。当前源码验证请启动两个提供方，再启动模板（分别在仓库根目录的终端运行）：

```powershell
pnpm --filter @melt-js/comps-vue2 run start
pnpm --filter @melt-js/comps-vue2-ele run start
pnpm --filter @melt-js/comps-vue2-ele-vea run start
pnpm --filter @melt-js/tpl-vue2-admin-ele-vea run dev:local
```

模板地址 `http://localhost:50010`，演示账户 `admin`，密码可使用页面默认值。`dev:local` 只切换环境，不会自动构建或启动兄弟包。

`.env` 默认 localhost，`.env.production` 默认 SFTP；托管地址由包内环境文件明确维护。发布顺序：先发布并托管 comps-vue2-ele-vea（以及仍提供 TierRanking 的 comps-vue2-ele），再发布模板；旧版本的 npm 代理和托管实现不具备新导出，不能只替换其中一份。准备阶段不要把源码联调通过当成线上托管已更新。

```powershell
pnpm run ci
pnpm --filter @melt-js/tpl-vue2-admin-ele-vea run lint
pnpm --filter @melt-js/tpl-vue2-admin-ele-vea run test:unit -- --runInBand
pnpm --filter @melt-js/comps-vue2-ele-vea run build
pnpm --filter @melt-js/tpl-vue2-admin-ele-vea run build
```

### 验证与发布前置条件（2026-11-15）

模板 lint、11 个测试套件 / 48 项测试及两个包生产构建通过。浏览器验证了页签切换保留输入、刷新与关闭后重建、综合表单加载和保存，以及综合表格导出 20 条数据后重新导入预览。

根目录 `pnpm run ci` 前一轮通过；最后一轮的包边界、核心/导出、全部 24 个组件包的 gzip 和构建检查通过，最终在环境测试中有 2 项失败：`scripts/tests/download-examples.test.mjs:51` 仍用 Vue 导入正则检查 `demo-react`、`demo-react-fin` 的 React `DemoStage`。这是本次 Vue2 改造之外的工作区状态，未修改对应 React 代码或测试。

两个包还在仓库外复制了独立源码目录，将 workspace 依赖改为版本或本地 tarball，分别安装并完成完整 build。公共包补齐了自身 `sass` / `sass-loader` 开发依赖，避免借用仓库根目录的工具链。源码构建验证与 npm 静态产物交付分开进行，保持原有 files 清单。

按原有 files 清单打包，在仓库外 consumer 安装并检查具名代理、hel-meta 和模板静态页通过。当前注册表的 `@melt-js/comps-vue2@2026.11.6-4` 仍将 `@melt-js/libs-vue2-leva` 声明为 `workspace:*`，直接独立安装会报 `EUNSUPPORTEDPROTOCOL`；验证时将该包也替换为本地 `pnpm pack` 产物。正式发布前需要修复并发布这条依赖链，再更新模板依赖，不能用本地 tarball 验证代替线上可安装性。
