# Oops Framework 使用规范

## 概述

Oops Framework 是一个基于 Cocos Creator 3.x 的游戏开发框架，提供 ECS 架构、GUI 管理、资源管理、网络通信等功能。

**框架位置**：`extensions/oops-plugin-framework/`

**核心导入路径**：
```typescript
import { oops } from "db://oops-framework/core/Oops";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { CCView } from "db://oops-framework/module/common/CCView";
```

---

## 1. ECS 架构

### 1.1 核心概念

| 概念 | 说明 | 基类/装饰器 |
|------|------|-------------|
| Entity | 实体，模块容器 | `CCEntity` |
| Component | 组件，数据容器 | `ecs.Comp` |
| System | 系统，业务逻辑 | `ecs.ComblockSystem` |
| View | 视图，UI组件 | `CCView` |

### 1.2 实体（Entity）

实体是模块的容器，继承 `CCEntity`。

```typescript
// assets/script/game/farm/Farm.ts
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { FarmModelComp } from "./model/FarmModelComp";

@ecs.register('Farm')
export class Farm extends CCEntity {
    // 声明组件属性（自动注入）
    FarmModel!: FarmModelComp;

    protected init() {
        // 添加组件
        this.addComponents<ecs.Comp>(FarmModelComp);
    }
}
```

**关键点**：
- 使用 `@ecs.register('ModuleName')` 装饰器注册
- 在 `init()` 中添加组件
- 组件属性名必须与组件类名对应（去掉Comp后缀）

### 1.3 组件（Component）

组件是数据容器，继承 `ecs.Comp`。

```typescript
// assets/script/game/farm/model/FarmModelComp.ts
import { ecs } from "db://oops-framework/libs/ecs/ECS";

@ecs.register('FarmModel')
export class FarmModelComp extends ecs.Comp {
    /** 金币数量 */
    gold: number = 0;

    /** 田地数据 */
    fields: FieldData[] = [];

    /** 当前天数 */
    currentDay: number = 1;

    /** 重置组件数据 */
    reset() {
        this.gold = 0;
        this.fields = [];
        this.currentDay = 1;
    }
}
```

**关键点**：
- 使用 `@ecs.register('ComponentName')` 注册
- 必须实现 `reset()` 方法
- 组件只存储数据，不包含逻辑

### 1.4 系统（System）

系统处理业务逻辑，继承 `ecs.ComblockSystem`。

```typescript
// assets/script/game/farm/system/PlantSystem.ts
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { FarmModelComp } from "../model/FarmModelComp";
import type { Farm } from "../Farm";

@ecs.register('Farm')
export class PlantSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {

    /** 定义过滤器，匹配包含指定组件的实体 */
    filter(): ecs.IMatcher {
        return ecs.allOf(FarmModelComp);
    }

    /** 实体进入系统时触发 */
    entityEnter(entity: Farm): void {
        console.log('Farm entity entered');
        // 初始化逻辑
    }

    /** 实体离开系统时触发（需实现 IEntityRemoveSystem） */
    entityRemove(entity: Farm): void {
        console.log('Farm entity removed');
        // 清理逻辑
    }
}
```

**系统接口**：

| 接口 | 方法 | 说明 |
|------|------|------|
| `IEntityEnterSystem` | `entityEnter(e)` | 实体进入时触发 |
| `IEntityRemoveSystem` | `entityRemove(e)` | 实体离开时触发 |
| `ISystemUpdate` | `update(dt)` | 每帧更新 |
| `ISystemFirstUpdate` | `firstUpdate(e)` | 首次更新时触发 |

### 1.5 视图（View）

视图处理 UI 展示，继承 `CCView`。

```typescript
// assets/script/game/farm/view/FarmViewComp.ts
import { _decorator, Node } from "cc";
import { gui } from "db://oops-framework/core/gui/Gui";
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCView } from "db://oops-framework/module/common/CCView";
import type { Farm } from "../Farm";

const { ccclass, property } = _decorator;

@ccclass('FarmViewComp')
@ecs.register('FarmView', false)
@gui.register('FarmView', {
    layer: LayerType.UI,
    prefab: "farm/farm_view",
    bundle: "gui"
})
export class FarmViewComp extends CCView<Farm> {

    @property(Node)
    fieldContainer: Node = null!;

    start() {
        this.initUI();
    }

    private initUI(): void {
        // 初始化 UI
    }

    /** 刷新界面 */
    refresh(): void {
        // 刷新数据显示
    }

    reset() {
        this.node.destroy();
    }
}
```

**关键装饰器**：
- `@ccclass('ClassName')` - Cocos 组件注册
- `@ecs.register('ViewName', false)` - ECS 注册，false 表示不创建实体
- `@gui.register()` - GUI 系统注册，配置层级、预制体、bundle

---

## 2. 单例模块注册

### 2.1 SingletonModuleComp

所有游戏模块通过 `smc` 单例访问。

```typescript
// assets/script/game/common/SingletonModuleComp.ts
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Account } from "../account/Account";
import type { Initialize } from "../initialize/Initialize";
import type { Farm } from "../farm/Farm";          // 新增
import type { Factory } from "../factory/Factory";  // 新增
import type { Store } from "../store/Store";        // 新增
import type { Town } from "../town/Town";          // 新增

@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 初始化模块 */
    initialize: Initialize = null!;
    /** 账号模块 */
    account: Account = null!;
    /** 农场模块 */
    farm: Farm = null!;           // 新增
    /** 工厂模块 */
    factory: Factory = null!;     // 新增
    /** 商店模块 */
    store: Store = null!;         // 新增
    /** 城镇模块 */
    town: Town = null!;           // 新增

    reset() { }
}

export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);
```

### 2.2 Main.ts 初始化

在 `Main.ts` 的 `run()` 方法中初始化模块。

```typescript
// assets/script/Main.ts
import { Farm } from './game/farm/Farm';
import { Factory } from './game/factory/Factory';
import { Store } from './game/store/Store';
import { Town } from './game/town/Town';

@ccclass('Main')
export class Main extends Root {
    protected run() {
        // 基础模块
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        smc.account = ecs.getEntity<Account>(Account);

        // 游戏模块
        smc.farm = ecs.getEntity<Farm>(Farm);
        smc.factory = ecs.getEntity<Factory>(Factory);
        smc.store = ecs.getEntity<Store>(Store);
        smc.town = ecs.getEntity<Town>(Town);
    }
}
```

---

## 3. GUI 系统

### 3.1 层级定义

```typescript
// 层级从低到高
export enum LayerType {
    Game,      // 游戏层（3D场景）
    UI,        // UI层（主界面）
    PopUp,     // 弹出层（浮窗）
    Dialog,    // 对话框层
    System,    // 系统层（加载中等）
    Notify,    // 通知层（Toast）
    Guide      // 引导层（新手引导）
}
```

### 3.2 UI 配置

```typescript
// assets/script/game/common/config/GameUIConfig.ts
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { UIConfig } from "db://oops-framework/core/gui/layer/UIConfig";

export enum UIID {
    Alert,
    Confirm,
    Farm,      // 新增
    Factory,   // 新增
    Store,     // 新增
    Town,      // 新增
}

export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert" },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm" },
    [UIID.Farm]: { layer: LayerType.UI, prefab: "farm/farm_view", bundle: "gui" },
    [UIID.Factory]: { layer: LayerType.UI, prefab: "factory/factory_view", bundle: "gui" },
    [UIID.Store]: { layer: LayerType.UI, prefab: "store/store_view", bundle: "gui" },
    [UIID.Town]: { layer: LayerType.UI, prefab: "town/town_view", bundle: "gui" },
};
```

### 3.3 打开/关闭 UI

```typescript
import { oops } from "db://oops-framework/core/Oops";
import { UIID } from "./config/GameUIConfig";

// 打开 UI
oops.gui.open(UIID.Farm);

// 带参数打开
oops.gui.open(UIID.Alert, {
    title: "提示",
    content: "操作成功"
});

// 关闭 UI
oops.gui.remove(UIID.Farm);

// 关闭并销毁
oops.gui.remove(UIID.Farm, true);
```

### 3.4 通过实体添加视图

```typescript
// 在实体中添加视图
await entity.addUi(FarmViewComp);

// 在实体中移除视图
entity.removeUi(FarmViewComp);
```

---

## 4. 事件系统

### 4.1 事件定义

```typescript
// assets/script/game/common/config/GameEvent.ts
export enum GameEvent {
    // 通用事件
    GameServerConnected = "GameServerConnected",
    LoginSuccess = "LoginSuccess",

    // 农场事件
    FarmPlanted = "FarmPlanted",
    FarmHarvested = "FarmHarvested",
    FarmUpgraded = "FarmUpgraded",

    // 工厂事件
    FactoryProduced = "FactoryProduced",
    MachineUnlocked = "MachineUnlocked",

    // 商店事件
    ProductSold = "ProductSold",
    CustomerServed = "CustomerServed",

    // 通用游戏事件
    GoldChanged = "GoldChanged",
    DayPassed = "DayPassed",
}
```

### 4.2 事件监听

```typescript
import { oops } from "db://oops-framework/core/Oops";
import { GameEvent } from "./config/GameEvent";

// 注册监听
onLoad() {
    oops.message.on(GameEvent.GoldChanged, this.onGoldChanged, this);
    oops.message.on(GameEvent.DayPassed, this.onDayPassed, this);
}

// 处理事件
private onGoldChanged(gold: number): void {
    console.log("金币变化:", gold);
}

private onDayPassed(day: number): void {
    console.log("新的一天:", day);
}

// 取消监听（必须在 onDestroy 中调用）
onDestroy() {
    oops.message.off(GameEvent.GoldChanged, this.onGoldChanged, this);
    oops.message.off(GameEvent.DayPassed, this.onDayPassed, this);
}
```

### 4.3 发送事件

```typescript
import { oops } from "db://oops-framework/core/Oops";
import { GameEvent } from "./config/GameEvent";

// 发送事件
oops.message.dispatchEvent(GameEvent.GoldChanged, 1000);

// 发送多个参数
oops.message.dispatchEvent(GameEvent.FarmHarvested, {
    cropId: 1,
    amount: 10,
    fieldIndex: 0
});
```

---

## 5. 资源管理

### 5.1 加载资源

```typescript
import { oops } from "db://oops-framework/core/Oops";
import { Prefab, SpriteFrame, AudioClip } from "cc";

// 加载单个资源
oops.res.load("path/to/asset", Prefab, (err, asset) => {
    if (err) { console.error(err); return; }
    // 使用 asset
});

// 加载目录
oops.res.loadDir("path/to/dir", (err, assets) => {
    // 所有资源加载完成
});

// 加载 Bundle
async loadBundle() {
    const bundle = await oops.res.loadBundle("bundleName");
    // bundle 加载完成
}
```

### 5.2 释放资源

```typescript
// 释放单个资源
oops.res.release("path/to/asset");

// 释放 Bundle
oops.res.releaseBundle("bundleName");
```

---

## 6. 异步队列

用于顺序执行异步任务。

```typescript
import { AsyncQueue, NextFunction } from "db://oops-framework/libs/collection/AsyncQueue";

const queue = new AsyncQueue();

// 添加任务
queue.push((next: NextFunction) => {
    console.log("任务1");
    setTimeout(() => {
        next(); // 调用 next 继续下一个任务
    }, 1000);
});

queue.push((next: NextFunction) => {
    console.log("任务2");
    next();
});

// 异步任务
queue.push(async (next: NextFunction) => {
    await someAsyncOperation();
    next();
});

// 设置完成回调
queue.complete = () => {
    console.log("所有任务完成");
};

// 开始执行
queue.play();
```

---

## 7. 数据存储

### 7.1 本地存储

```typescript
import { oops } from "db://oops-framework/core/Oops";

// 存储
oops.storage.set("key", "value");
oops.storage.setNumber("score", 100);
oops.storage.setObject("playerData", { name: "test", level: 1 });

// 读取
const value = oops.storage.get("key");
const score = oops.storage.getNumber("score", 0);  // 0 是默认值
const data = oops.storage.getObject("playerData");

// 删除
oops.storage.remove("key");

// 清空
oops.storage.clear();
```

### 7.2 存储配置

```typescript
// assets/script/game/common/config/GameStorageConfig.ts
export enum StorageKey {
    Language = "language",
    MusicVolume = "musicVolume",
    SFXVolume = "sfxVolume",
    PlayerData = "playerData",
    MissionProgress = "missionProgress",
}
```

---

## 8. 多语言

### 8.1 设置语言

```typescript
import { oops } from "db://oops-framework/core/Oops";

// 设置语言
oops.language.setLanguage("zh", () => {
    console.log("语言切换完成");
});

// 获取当前语言
const currentLang = oops.language.current;
```

### 8.2 获取文本

```typescript
import { oops } from "db://oops-framework/core/Oops";

// 获取翻译文本
const text = oops.language.getLangByID("key_name");

// 带参数的翻译
const formatted = oops.language.getLangByID("greeting", { name: "玩家" });
```

---

## 9. 网络通信

### 9.1 HTTP 请求

```typescript
import { oops } from "db://oops-framework/core/Oops";

// GET 请求
oops.http.get("url", (response) => {
    console.log(response);
});

// POST 请求
oops.http.post("url", { data: "value" }, (response) => {
    console.log(response);
});
```

### 9.2 WebSocket

```typescript
import { oops } from "db://oops-framework/core/Oops";

// 连接
oops.ws.connect("ws://server:port");

// 发送消息
oops.ws.send({ type: "login", data: {} });

// 监听消息
oops.ws.on("message", (data) => {
    console.log(data);
});

// 断开连接
oops.ws.close();
```

---

## 10. 模块开发模板

### 10.1 完整模块结构

```
assets/script/game/farm/
├── Farm.ts                    # 实体类
├── model/
│   └── FarmModelComp.ts      # 数据组件
├── system/
│   ├── PlantSystem.ts        # 种植系统
│   ├── GrowthSystem.ts       # 生长系统
│   └── HarvestSystem.ts      # 收获系统
├── view/
│   ├── FarmViewComp.ts       # 主界面
│   └── FieldViewComp.ts      # 田地组件
└── bll/
    └── FarmLogic.ts          # 业务逻辑（可选）
```

### 10.2 快速创建模块

**步骤1：创建实体**
```typescript
// Farm.ts
@ecs.register('Farm')
export class Farm extends CCEntity {
    FarmModel!: FarmModelComp;
    protected init() {
        this.addComponents<ecs.Comp>(FarmModelComp);
    }
}
```

**步骤2：创建数据组件**
```typescript
// model/FarmModelComp.ts
@ecs.register('FarmModel')
export class FarmModelComp extends ecs.Comp {
    gold: number = 0;
    reset() { this.gold = 0; }
}
```

**步骤3：注册单例**
```typescript
// SingletonModuleComp.ts
farm: Farm = null!;
```

**步骤4：初始化**
```typescript
// Main.ts run()
smc.farm = ecs.getEntity<Farm>(Farm);
```

**步骤5：使用**
```typescript
// 任意位置
smc.farm.FarmModel.gold = 100;
```

---

## 11. 常见问题

### 11.1 组件属性无法访问

**问题**：`smc.farm.FarmModel` 为 `undefined`

**原因**：组件属性名与注册名不匹配

**解决**：确保属性名与 `@ecs.register('Name')` 中的 Name 一致（不含Comp后缀）

```typescript
// 正确
FarmModel!: FarmModelComp;  // 属性名 FarmModel

// 错误
farmModel!: FarmModelComp;  // 小写不匹配
```

### 11.2 事件监听未触发

**问题**：`on` 注册的事件收不到

**原因**：`this` 上下文丢失

**解决**：确保传入正确的 `this`
```typescript
// 正确
oops.message.on(GameEvent.XX, this.handler, this);

// 错误
oops.message.on(GameEvent.XX, this.handler);  // 缺少 this
```

### 11.3 UI 打开失败

**问题**：`oops.gui.open(UIID.XX)` 无反应

**原因**：
1. 预制体路径错误
2. Bundle 未加载
3. UIConfigData 未配置

**解决**：
```typescript
// 检查配置
[UIID.Farm]: {
    layer: LayerType.UI,
    prefab: "farm/farm_view",  // 确保路径正确
    bundle: "gui"               // 确保 bundle 已加载
}
```

---

## 12. 框架 API 速查

### oops 核心对象

| API | 说明 |
|-----|------|
| `oops.gui` | GUI 管理 |
| `oops.res` | 资源管理 |
| `oops.audio` | 音频管理 |
| `oops.storage` | 本地存储 |
| `oops.language` | 多语言 |
| `oops.message` | 事件系统 |
| `oops.http` | HTTP 请求 |
| `oops.ws` | WebSocket |
| `oops.timer` | 定时器 |

### ecs 核心对象

| API | 说明 |
|-----|------|
| `ecs.register()` | 注册装饰器 |
| `ecs.getEntity()` | 获取实体 |
| `ecs.getSingleton()` | 获取单例组件 |
| `ecs.allOf()` | 匹配所有组件 |
| `ecs.anyOf()` | 匹配任一组件 |

---

*最后更新：2025-01-07*
