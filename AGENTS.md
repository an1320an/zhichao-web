# 知潮跨仓协作规则

本文件对所有在官网仓库工作的 AI 和人工程序员生效。

## 开始任务前（强制）

1. 先完整阅读 `../zhichao/docs/HANDOFF.md` 的 `MANDATORY PROTOCOL`、`Current Snapshot`、`Current Known Design Decisions`、`Known Issues / Watch Points` 和 `Recommended Next Step`。
2. 涉及产品方向、新模块、发布、法律文案或长期边界时，再阅读 `../zhichao/docs/ZHICHAO_LONG_TERM_PRODUCT_TECH_ARCHITECTURE.md`。
3. 如果本地没有共享仓，使用 <https://github.com/an1320an/zhichao/blob/main/docs/HANDOFF.md> 定位当前规则，并在完成任务前取得可写的共享交接入口。
4. 用户最新明确指令优先，但不能绕过安全、公开文案、发布和历史退役边界。
5. 编辑前检查工作区状态，保留用户和其他工具已有的未提交改动。

## 执行与结束任务（强制）

- 每轮只推进一个任务编号和一个主要结果，不夹带无关功能。
- 开始前明确目标、不做事项、验收标准和发布边界。
- 不在前端或公开仓库写入密钥、令牌、真实用户数据或私有运营数据。
- 未经用户明确要求，不部署官网、不替换 APK、不修改强制更新、不发送广播。
- 完成前运行与风险相称的 lint、公开文案审计、build 或运行检查，并形成清晰提交。
- 在宣称完成前，必须更新共享 `../zhichao/docs/HANDOFF.md`：记录任务编号、所有仓库提交、已验证和未验证内容、部署/发布状态，并重写 `Recommended Next Step`。
- 新增或迁移模块时更新 `PROJECT_INDEX.md`；改变产品方向、目标架构或阶段顺序时更新长期架构文档。
- 有远端时推送正常提交，禁止强推。

**没有更新共享 HANDOFF，就不能把有实际变更的任务标记为完成。** 如果当前环境无法修改共享仓，应报告阻塞，不得假装交接已经完成。
