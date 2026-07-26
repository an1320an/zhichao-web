# 知潮官网

知潮官网、公开法律页面、邀请入口和 Android APK 下载页面，基于 React、TypeScript 和 Vite。

## 协作入口

开始开发前必须阅读：

- [`AGENTS.md`](AGENTS.md)：本仓公开文案、发布和跨仓交接规则；
- [`../zhichao/docs/HANDOFF.md`](../zhichao/docs/HANDOFF.md)：当前正式状态、最新断点和唯一下一项；
- [`../zhichao/docs/ZHICHAO_LONG_TERM_PRODUCT_TECH_ARCHITECTURE.md`](../zhichao/docs/ZHICHAO_LONG_TERM_PRODUCT_TECH_ARCHITECTURE.md)：长期产品与技术方向。

任何 AI 或人工程序员完成实际改动后，都必须更新共享 HANDOFF。没有交接记录的任务不能标记为完成。

## 常用命令

```bash
npm install
npm run lint
npm run audit:copy
npm run build
```

部署官网、替换 APK、修改强制更新和发送广播只有在用户明确要求时才能执行。

## Vite 说明

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
