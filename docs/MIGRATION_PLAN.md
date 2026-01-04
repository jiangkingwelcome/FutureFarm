# Unity → Cocos Creator 移植方案

## 总体原则

1. **自底向上** - 先数据层，再逻辑层，最后表现层
2. **最小可验证单元** - 每个任务完成后可独立测试
3. **渐进式** - 保持项目随时可运行

---

## 阶段一：数据基础层

### 1.1 配置系统搭建

**目标**：建立游戏配置数据的加载和管理机制

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 1.1.1 | 创建配置管理器基类 | `script/game/common/config/ConfigManager.ts` |
| 1.1.2 | 将 XML 关卡配置转为 JSON | `resources/config/missions/*.json` |
| 1.1.3 | 创建关卡配置加载器 | `script/game/common/config/MissionConfig.ts` |

**验证点**：能正确加载并打印第1关配置数据

---

### 1.2 核心数据模型

**目标**：创建与 Unity 对应的数据类

| 任务 | Unity 源文件 | Cocos 输出 |
|------|-------------|-----------|
| 1.2.1 | `ItemAbstract.cs` | `script/game/data/ItemBase.ts` |
| 1.2.2 | `MissionData.cs` → TargetCommon | `script/game/data/MissionData.ts` |
| 1.2.3 | `MissionData.cs` → StarMission | 同上 |
| 1.2.4 | `FarmDataMission.cs` | `script/game/data/FarmData.ts` |
| 1.2.5 | `FactoryDataMission.cs` | `script/game/data/FactoryData.ts` |
| 1.2.6 | `ShopDataMission.cs` | `script/game/data/ShopData.ts` |
| 1.2.7 | `TownDataMission.cs` | `script/game/data/TownData.ts` |

**验证点**：能从 JSON 配置初始化所有数据模型

---

### 1.3 游戏状态管理

**目标**：建立全局游戏状态管理

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 1.3.1 | 创建游戏状态实体 | `script/game/gameState/GameState.ts` |
| 1.3.2 | 游戏状态数据组件 | `script/game/gameState/model/GameStateModel.ts` |
| 1.3.3 | 金钱/时间/星级管理 | 同上 |

**验证点**：能保存和读取游戏进度

---

## 阶段二：农场模块 (Farm)

### 2.1 农场数据层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 2.1.1 | 农场实体 | `script/game/farm/Farm.ts` |
| 2.1.2 | 农场数据组件 | `script/game/farm/model/FarmModel.ts` |
| 2.1.3 | 田地数据 | `script/game/farm/model/FieldModel.ts` |
| 2.1.4 | 作物/动物数据 | `script/game/farm/model/CropModel.ts` |

**验证点**：能初始化农场数据，打印田地和作物状态

---

### 2.2 农场逻辑层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 2.2.1 | 种植系统 | `script/game/farm/system/PlantSystem.ts` |
| 2.2.2 | 生长系统 | `script/game/farm/system/GrowthSystem.ts` |
| 2.2.3 | 收获系统 | `script/game/farm/system/HarvestSystem.ts` |
| 2.2.4 | 养殖系统 | `script/game/farm/system/BreedSystem.ts` |

**验证点**：能模拟种植→生长→收获流程（控制台输出）

---

### 2.3 农场视图层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 2.3.1 | 农场场景搭建 | `scene/Farm.scene` |
| 2.3.2 | 农场主界面 | `script/game/farm/view/FarmViewComp.ts` |
| 2.3.3 | 田地格子组件 | `script/game/farm/view/FieldViewComp.ts` |
| 2.3.4 | 作物显示组件 | `script/game/farm/view/CropViewComp.ts` |
| 2.3.5 | 农场 UI 预制体 | `resources/gui/farm/*.prefab` |

**验证点**：能看到农场界面，点击田地有响应

---

## 阶段三：工厂模块 (Factory)

### 3.1 工厂数据层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 3.1.1 | 工厂实体 | `script/game/factory/Factory.ts` |
| 3.1.2 | 工厂数据组件 | `script/game/factory/model/FactoryModel.ts` |
| 3.1.3 | 机器数据 | `script/game/factory/model/MachineModel.ts` |
| 3.1.4 | 产品数据 | `script/game/factory/model/ProductModel.ts` |

---

### 3.2 工厂逻辑层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 3.2.1 | 生产系统 | `script/game/factory/system/ProductionSystem.ts` |
| 3.2.2 | 机器管理系统 | `script/game/factory/system/MachineSystem.ts` |
| 3.2.3 | 队列系统 | `script/game/factory/system/QueueSystem.ts` |

---

### 3.3 工厂视图层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 3.3.1 | 工厂场景搭建 | `scene/Factory.scene` |
| 3.3.2 | 工厂主界面 | `script/game/factory/view/FactoryViewComp.ts` |
| 3.3.3 | 机器组件 | `script/game/factory/view/MachineViewComp.ts` |
| 3.3.4 | 产品队列组件 | `script/game/factory/view/QueueViewComp.ts` |

---

## 阶段四：商店模块 (Store)

### 4.1 商店数据层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 4.1.1 | 商店实体 | `script/game/store/Store.ts` |
| 4.1.2 | 商店数据组件 | `script/game/store/model/StoreModel.ts` |
| 4.1.3 | 货架数据 | `script/game/store/model/ShelfModel.ts` |

---

### 4.2 商店逻辑层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 4.2.1 | 销售系统 | `script/game/store/system/SellSystem.ts` |
| 4.2.2 | 顾客系统 | `script/game/store/system/CustomerSystem.ts` |
| 4.2.3 | 库存系统 | `script/game/store/system/InventorySystem.ts` |

---

### 4.3 商店视图层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 4.3.1 | 商店场景搭建 | `scene/Store.scene` |
| 4.3.2 | 商店主界面 | `script/game/store/view/StoreViewComp.ts` |
| 4.3.3 | 货架组件 | `script/game/store/view/ShelfViewComp.ts` |

---

## 阶段五：城镇模块 (Town)

### 5.1 城镇数据层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 5.1.1 | 城镇实体 | `script/game/town/Town.ts` |
| 5.1.2 | 城镇数据组件 | `script/game/town/model/TownModel.ts` |
| 5.1.3 | 员工数据 | `script/game/town/model/StaffModel.ts` |
| 5.1.4 | 建筑数据 | `script/game/town/model/BuildingModel.ts` |

---

### 5.2 城镇逻辑层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 5.2.1 | 员工管理系统 | `script/game/town/system/StaffSystem.ts` |
| 5.2.2 | 培训系统 | `script/game/town/system/TrainingSystem.ts` |
| 5.2.3 | 建筑系统 | `script/game/town/system/BuildingSystem.ts` |

---

### 5.3 城镇视图层

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 5.3.1 | 城镇场景搭建 | `scene/Town.scene` |
| 5.3.2 | 城镇主界面 | `script/game/town/view/TownViewComp.ts` |
| 5.3.3 | 建筑组件 | `script/game/town/view/BuildingViewComp.ts` |

---

## 阶段六：关卡与流程

### 6.1 关卡系统

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 6.1.1 | 关卡管理实体 | `script/game/mission/Mission.ts` |
| 6.1.2 | 关卡数据组件 | `script/game/mission/model/MissionModel.ts` |
| 6.1.3 | 目标检测系统 | `script/game/mission/system/GoalSystem.ts` |
| 6.1.4 | 星级评价系统 | `script/game/mission/system/StarSystem.ts` |

---

### 6.2 场景切换

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 6.2.1 | 场景管理器 | `script/game/common/SceneManager.ts` |
| 6.2.2 | 导航系统 | `script/game/common/NavigationSystem.ts` |
| 6.2.3 | 底部导航栏 UI | `resources/gui/common/NavBar.prefab` |

---

### 6.3 主菜单与关卡选择

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 6.3.1 | 主菜单界面 | `script/game/menu/view/MenuViewComp.ts` |
| 6.3.2 | 关卡选择界面 | `script/game/menu/view/LevelSelectViewComp.ts` |
| 6.3.3 | 关卡项组件 | `script/game/menu/view/LevelItemComp.ts` |

---

## 阶段七：通用 UI 组件

| 任务 | 说明 | 输出文件 |
|------|------|----------|
| 7.1 | 顶部状态栏（金钱、时间） | `resources/gui/common/TopBar.prefab` |
| 7.2 | 确认对话框 | `resources/gui/common/ConfirmDialog.prefab` |
| 7.3 | 提示弹窗 | `resources/gui/common/Toast.prefab` |
| 7.4 | 结果面板 | `resources/gui/common/ResultPanel.prefab` |
| 7.5 | 帮助/教程系统 | `script/game/help/HelpSystem.ts` |

---

## 阶段八：完善与优化

| 任务 | 说明 |
|------|------|
| 8.1 | 音效系统集成 |
| 8.2 | 动画效果完善 |
| 8.3 | 存档系统 |
| 8.4 | 多语言支持 |
| 8.5 | 性能优化 |

---

## 快速启动路径（MVP）

如果想尽快看到可运行的原型，建议按以下顺序：

```
1.1.1 → 1.1.2 → 1.1.3 (配置系统)
    ↓
1.2.1 → 1.2.2 → 1.2.4 (基础数据模型)
    ↓
2.1.1 → 2.1.2 (农场数据)
    ↓
2.2.1 → 2.2.3 (种植+收获)
    ↓
2.3.1 → 2.3.2 → 2.3.3 (农场界面)
    ↓
可运行的农场原型！
```

---

## 任务依赖图

```
阶段1 (数据基础)
    │
    ├── 1.1 配置系统 ──────────────────────────┐
    │                                          │
    └── 1.2 数据模型 ──┬── 1.2.4 FarmData ────┼── 阶段2 (农场)
                       │                       │
                       ├── 1.2.5 FactoryData ──┼── 阶段3 (工厂)
                       │                       │
                       ├── 1.2.6 ShopData ─────┼── 阶段4 (商店)
                       │                       │
                       └── 1.2.7 TownData ─────┼── 阶段5 (城镇)
                                               │
                                               └── 阶段6 (关卡流程)
                                                       │
                                                       └── 阶段7 (通用UI)
                                                               │
                                                               └── 阶段8 (完善)
```

---

## 估算工作量

| 阶段 | 任务数 | 复杂度 |
|------|--------|--------|
| 阶段1 | 10 | ⭐⭐ |
| 阶段2 | 12 | ⭐⭐⭐ |
| 阶段3 | 10 | ⭐⭐⭐ |
| 阶段4 | 9 | ⭐⭐ |
| 阶段5 | 10 | ⭐⭐⭐ |
| 阶段6 | 9 | ⭐⭐ |
| 阶段7 | 5 | ⭐⭐ |
| 阶段8 | 5 | ⭐⭐ |

**总计：约 70 个最小任务单元**

---

## 下一步

准备好开始后，我们从 **任务 1.1.1** 开始：创建配置管理器基类。
