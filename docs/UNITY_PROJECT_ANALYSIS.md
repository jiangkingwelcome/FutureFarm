# Unity 源项目结构分析

## 项目基本信息

- **项目名称**：Business Master / Game Source（农场经营游戏）
- **Unity 版本**：约 Unity 4.x（2014-2015年项目）
- **项目路径**：`E:\gitproject\cocos\Farm\Farm`

---

## 目录结构概览

```
Assets/
├── Animations/          # 动画资源
│   ├── Common/         # 通用动画（按钮、弹窗等）
│   ├── Factory/        # 工厂场景动画
│   ├── Farm/           # 农场场景动画
│   ├── Help/           # 帮助/教程动画
│   ├── Menu/           # 菜单动画
│   ├── Mission/        # 任务动画
│   ├── Store/          # 商店动画
│   └── Town/           # 城镇动画
├── CheckPackageHack/   # 第三方库（JsonDotNet）
├── Editor/             # Unity 编辑器扩展
├── Facebook/           # Facebook SDK 集成
├── Fonts/              # 字体资源
├── Images/             # 图片资源（按场景分类）
├── NGUI/               # NGUI UI 框架
├── OpenIAB-demo/       # 应用内购买 Demo
├── Pixelplacement/     # iTween 动画库
├── Plugins/            # 原生插件
├── Prefabs/            # 预制体
├── Resources/          # 运行时加载资源
├── Scenes/             # 场景文件
├── Scripts/            # 游戏脚本
├── Sounds/             # 音效资源
├── Spriter/            # Spriter 动画工具
└── ThirdParty/         # 其他第三方库
```

---

## 场景列表（9个场景）

| 场景文件 | 功能说明 |
|---------|---------|
| `LogoScene.unity` | 启动画面/Logo |
| `LoadingScene.unity` | 加载场景 |
| `Menu.unity` | 主菜单 |
| `Mission.unity` | 任务选择 |
| `Farm.unity` | 农场场景（种植、养殖） |
| `Factory.unity` | 工厂场景（生产加工） |
| `Store.unity` | 商店场景（销售） |
| `Town.unity` | 城镇场景（员工、设施） |
| `VilageResearch.unity` | 研究所场景 |

---

## 核心脚本模块

### 1. 通用模块 (`Scripts/Common/`)

| 文件 | 功能 |
|------|------|
| `MissionData.cs` | **核心数据管理器** - 读取XML配置，管理任务数据 |
| `ItemGame.cs` | 游戏物品数据类（种子、机器、产品列表） |
| `ReadXML.cs` | XML 配置文件读取器 |
| `AudioMenuScript.cs` | 音频菜单控制 |
| `WarningTextClass.cs` | 警告文本数据 |
| `WarningTextView.cs` | 警告文本显示 |
| `ResultPanelController.cs` | 结果面板控制 |
| `PanelComfirmExitController.cs` | 退出确认面板 |
| `PanelNewItemScript.cs` | 新物品提示面板 |
| `IconWeatherController.cs` | 天气图标控制 |

### 2. 农场模块 (`Scripts/Farm/`)

| 文件 | 功能 |
|------|------|
| `FarmDataMission.cs` | 农场任务数据（田地、养殖场、收获目标） |
| `HarvestPlantScript.cs` | 收获植物脚本 |
| `FasterButtonScript.cs` | 加速按钮 |
| `AddValueScript.cs` | 数值增加脚本 |
| `Breed.cs` | 养殖逻辑 |
| `CameracontrollerScript.cs` | 相机控制 |

**农场数据结构：**
- `FieldFarm` - 田地（id=1 农田, id=2 畜栏, id=3 池塘）
- `BreedFarm` - 养殖作物/动物
- `HarverstFarm` - 收获统计

### 3. 工厂模块 (`Scripts/Factory/`)

| 子目录 | 功能 |
|-------|------|
| `ReadDataMission/` | 工厂任务数据读取 |
| `ObjectController/` | 工厂对象控制器 |
| `Button/` | 按钮控制 |
| `Font/` | 字体/文本控制（BaPK、NGUI） |
| `Test/` | 测试脚本 |

**工厂数据结构：**
- `FactoryDataMission` - 工厂任务数据
- `MachineInData` - 机器数据（等级、产量目标）
- `PositionUnLockInData` - 位置解锁数据

### 4. 城镇模块 (`Scripts/Town/`)

| 子目录 | 功能 |
|-------|------|
| `TownDataMission.cs` | 城镇任务数据 |
| `ObjectController/` | 对象控制器（员工、物品、导航等） |
| `Button/` | 按钮控制 |
| `OtherController/` | 其他控制器 |

**城镇数据结构：**
- `StaffData` - 员工数据（等级、雇佣状态）
- `TargetTraining` - 培训目标
- 建筑类型：0=员工楼, 1=超市, 2=媒体中心, 3=研究所, 4=彩票屋

### 5. 商店模块 (`Scripts/Store/`)

| 文件 | 功能 |
|------|------|
| `ShopDataMission.cs` | 商店任务数据 |
| `ShowItemScript.cs` | 物品展示 |
| `GuideShopScript.cs` | 商店引导 |

### 6. 任务/关卡模块 (`Scripts/Mission/`)

| 子目录/文件 | 功能 |
|------------|------|
| `Dialog/` | 对话框（确认、加载、信息、每日礼物等） |
| `Item/` | 物品类（道具、每日礼物、头像等） |
| `Plugin/` | 插件工具（LeanTween, JsonHelper, PlayerPrefsX） |
| `Prefab/` | 预制体相关 |

### 7. 帮助/教程模块 (`Scripts/Help/`)

| 文件 | 功能 |
|------|------|
| `HelpGirlController.cs` | 帮助女孩动画控制 |
| `HandTapHelpController.cs` | 手指点击引导 |
| `PanelHelpController.cs` | 帮助面板控制 |

### 8. 研究所模块 (`Scripts/VilageResearch/`)

| 文件 | 功能 |
|------|------|
| `VilageResearchController.cs` | 研究所主控制器 |
| `FrameController.cs` | 框架控制 |
| `PanelFrameController.cs` | 面板框架控制 |

---

## 数据配置系统

### XML 任务配置 (`Resources/Mission/`)

游戏使用 XML 文件配置每个关卡的数据，共 **50+ 个关卡配置**。

**示例 (DataMission1.xml)：**
```xml
<Missions level="1">
  <Target startMoney="500" timeMission="7"/>
  <Star twoStar="100" threeStar="200" reward="1-2-3"/>

  <Farm>
    <Field id="1" startNumber="2"/>
    <Seed id="1" targetPlant="1"/>
  </Farm>

  <Factory countPosition="2">
    <Machine id="1"/>
  </Factory>

  <Shop>
    <Product id="7" targetProduction="1"/>
  </Shop>

  <City>
  </City>
</Missions>
```

### 配置字段说明

| 节点 | 属性 | 说明 |
|------|------|------|
| `Target` | startMoney | 初始金钱 |
| | timeMission | 任务时间限制 |
| | targetMoney | 目标金钱 |
| | maxCustomer | 最大顾客数 |
| `Star` | twoStar/threeStar | 2/3星评价条件 |
| | reward | 奖励配置 |
| `Farm/Field` | id | 田地类型 |
| | startNumber | 初始数量 |
| | targetNumber | 目标数量 |
| | startLevel/targetLevel | 等级范围 |
| `Factory/Machine` | id | 机器ID |
| | targetNumber | 生产目标 |
| `City` | 各建筑配置 | 城镇设施 |

---

## 第三方依赖

| 库/工具 | 用途 |
|--------|------|
| **NGUI** | UI 框架（主要 UI 系统） |
| **iTween/LeanTween** | 动画补间库 |
| **JsonDotNet** | JSON 序列化 |
| **Facebook SDK** | 社交登录/分享 |
| **OpenIAB** | 应用内购买 |
| **Spriter** | 骨骼动画工具 |

---

## 核心游戏流程

```
LogoScene → LoadingScene → Menu → Mission（选关）
                                    ↓
                              游戏场景循环
                    ┌─────────────────────────────┐
                    ↓                             ↓
                  Farm ←→ Factory ←→ Store ←→ Town
                    │                             │
                    └──────── VilageResearch ─────┘
```

### 游戏玩法核心

1. **农场 (Farm)**：种植作物、养殖动物、收获原材料
2. **工厂 (Factory)**：加工原材料为产品
3. **商店 (Store)**：销售产品赚取金钱
4. **城镇 (Town)**：管理员工、升级设施、媒体宣传、研究技术
5. **研究所 (VilageResearch)**：解锁新技术/配方

### 关卡目标类型

- 赚取目标金额
- 达到顾客满意度
- 完成指定生产量
- 升级指定设施等级
- 时间限制挑战

---

## 资源结构

### Images（图片资源）
```
Images/
├── Common/         # 通用UI图片
├── Factory/        # 工厂场景图片
├── Farm/           # 农场场景图片
├── Menu/           # 菜单图片
├── Mission/        # 任务界面图片
├── Store/          # 商店图片
├── storage/        # 仓储图片
├── Town/           # 城镇图片
└── VilageResearch/ # 研究所图片
```

### Prefabs（预制体）
```
Prefabs/
├── Avatar.prefab           # 头像
├── DialogHelp.prefab       # 帮助对话框
├── DialogLogin.prefab      # 登录对话框
├── ItemMission.prefab      # 任务物品
├── ItemRank.prefab         # 排名物品
├── LoadingScene.prefab     # 加载场景
├── MissionItem.prefab      # 任务项
└── SubDiamond.prefab       # 钻石子项
```

### Resources（运行时资源）
```
Resources/
├── Common/         # 通用资源
├── Factory/        # 工厂资源
├── Farm/           # 农场资源
├── Help/           # 帮助资源
├── Mission/        # 任务配置XML（DataMission1-50+.xml）
├── Shop/           # 商店资源
├── Storage/        # 仓储资源
├── Town/           # 城镇资源
└── VilageResearch/ # 研究所资源
```

---

## 转换到 Cocos Creator 的关键点

### 1. UI 系统迁移
- **Unity**: NGUI 框架
- **Cocos**: 使用原生 UI 系统 + oops.gui 层级管理

### 2. 动画系统迁移
- **Unity**: Animation/Animator + iTween/LeanTween
- **Cocos**: cc.Animation + cc.tween

### 3. 数据配置迁移
- **Unity**: XML 配置文件
- **Cocos**: 建议改用 JSON 或 Excel + TypeScript 表格

### 4. 场景结构迁移
- Unity 9 个场景 → Cocos 可合并或保持分离
- 建议使用 Bundle 管理不同场景资源

### 5. 核心架构对应

| Unity | Cocos (Oops Framework) |
|-------|----------------------|
| MonoBehaviour | ecs.Comp / CCEntity |
| Static 数据类 | ModelComp |
| Controller 脚本 | System |
| UI 脚本 | ViewComp |

### 6. 优先转换顺序建议

1. 数据模型层（MissionData, FarmData, etc.）
2. 核心游戏逻辑（Farm, Factory, Store, Town）
3. UI 界面
4. 动画效果
5. 音效系统
6. 社交/支付功能

---

## 下一步行动

- [ ] 创建数据模型对应的 TypeScript 类
- [ ] 设计 XML → JSON/Excel 配置转换方案
- [ ] 规划场景和资源结构
- [ ] 开始核心模块转换
