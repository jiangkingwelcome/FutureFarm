# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要规则

1. **全部使用中文** - 所有回复、注释、文档均使用中文
2. **Unity 转 Cocos 项目**：
   - **源码参考**：`E:\gitproject\cocos\Farm\Farm`（Unity 项目，只读不改）
   - **目标项目**：`E:\gitproject\cocos\Farm\FutureFarm`（Cocos Creator 项目，所有修改都在这里进行）
3. **文档与进度**：`docs/` 目录存放项目文档和修改进度记录
4. **代码作者信息**：
   ```
   @Author: jiangking
   @Email: jiangkingwelcome@vip.qq.com
   @Phone: 13816629321
   ```

## 项目概述

**FutureFarm** - 基于 **Oops Framework** 使用 **Cocos Creator 3.8.7** 开发的农场游戏。

主要特性：
- ECS 架构 + MVC 模式
- 多语言支持 (zh/en)
- WebSocket 网络通信
- Excel 驱动的数据配置

## 构建与开发

本项目使用 Cocos Creator 编辑器构建，无 npm 脚本：
- 使用 Cocos Creator 3.8.7 打开项目
- 构建：文件 > 构建发布
- 预览：编辑器播放按钮或浏览器预览

**插件更新**（在项目根目录执行）：
```bash
update-oops-plugin-framework.bat      # 核心框架
update-oops-plugin-excel-to-json.bat  # Excel 数据生成器
update-oops-plugin-hot-update.bat     # 热更新系统
```

**数据生成**：`excel/` 目录下的 Excel 文件通过 oops-plugin-excel-to-json 转换为 TypeScript。

## 架构

### ECS + MVC 模式

游戏模块位于 `assets/script/game/`：
- **实体 (Entity)**：模块容器（`Initialize`、`Account`），继承 `CCEntity`
- **组件 (Component)**：数据组件（`*ModelComp`）和行为组件（`*Comp`）
- **系统 (System)**：业务逻辑（`*System`，使用 `ecs.ComblockSystem`）
- **视图 (View)**：UI 组件（`*ViewComp`）

```typescript
// 实体注册 (assets/script/game/mymodule/MyModule.ts)
@ecs.register('MyModule')
export class MyModule extends CCEntity {
    MyModelComp!: MyModelComp;
    protected init() {
        this.addComponents<ecs.Comp>(MyModelComp);
    }
}

// 通过单例全局访问
import { smc } from "./common/SingletonModuleComp";
smc.account.AccountModel  // 访问模块组件
```

### 框架导入

```typescript
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { oops } from "db://oops-framework/core/Oops";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
```

### 入口文件

- `Main.ts` - 继承 `Root`，初始化 GUI 和游戏模块
- `InitRes.ts` - 通过 `AsyncQueue` 管理资源加载流程
- `SingletonModuleComp.ts` - 全局模块注册表（`smc`）

### GUI 层级系统

七层结构定义在 `assets/resources/config.json`：
LayerGame < LayerUI < LayerPopUp < LayerDialog < LayerSystem < LayerNotify < LayerGuide

UI 配置在 `GameUIConfig.ts`：
```typescript
export enum UIID { Alert, Confirm, /* ... */ }
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert" },
};
```

## 常用模式

### 添加新模块

1. 创建 `assets/script/game/mymodule/MyModule.ts`：
```typescript
@ecs.register('MyModule')
export class MyModule extends CCEntity {
    protected init() { /* 添加组件 */ }
}
```

2. 在 `SingletonModuleComp.ts` 中注册：
```typescript
mymodule: MyModule = null!;
```

3. 在 `Main.ts` 的 `run()` 中初始化：
```typescript
smc.mymodule = ecs.getEntity<MyModule>(MyModule);
```

### UI 操作

```typescript
oops.gui.open(UIID.MyScreen);           // 显示 UI
oops.gui.remove(UIID.MyScreen, true);   // 移除 UI
```

### 事件系统

```typescript
oops.message.on(GameEvent.MY_EVENT, this.handler, this);
oops.message.dispatchEvent(GameEvent.MY_EVENT, data);
```

### 资源加载

```typescript
oops.res.load("path", SpriteFrame, (err, asset) => {});
oops.res.loadDir("path", onProgress, onComplete);
await oops.res.loadBundle('bundleName');
```

## 配置

环境配置在 `assets/resources/config.json`：
- `type`：当前环境（`dev`/`test`/`prod`）
- 服务器：`httpServer`、`webSocketServer`
- 语言：默认 `zh`，支持 `zh`/`en`

## Cocos MCP 服务器

扩展位于 `extensions/cocos-mcp-server/`，为 Cocos Creator 提供 AI 工具。

启动：Cocos Creator > 扩展 > Cocos MCP Server > 启动服务器
地址：`http://127.0.0.1:3000/mcp`

关键工作流程：
- 修改节点前先用 `node_query` 获取 UUID
- 设置属性前先用 `component_query` 检查属性类型
- 切换场景前先保存
