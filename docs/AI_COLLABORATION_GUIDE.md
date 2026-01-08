# AI协作开发指南

## 概述

本文档为多AI工具（Claude、GPT、Cursor等）协作开发提供统一规范。所有AI在参与Farm项目移植时必须遵循本指南。

---

## 项目基本信息

| 项目 | 路径 | 说明 |
|------|------|------|
| Unity源项目 | `E:\gitproject\cocos\Farm\Farm` | **只读**，不得修改 |
| Cocos目标项目 | `E:\gitproject\cocos\Farm\FutureFarm` | 所有修改在这里进行 |
| 文档目录 | `FutureFarm/docs/` | 进度、方案、规范文档 |

**技术栈**
- 源：Unity 4.x + C# + NGUI + iTween (2014-2015)
- 目标：Cocos Creator 3.8.7 + TypeScript + Oops Framework

**代码作者信息**
```
@Author: jiangking
@Email: jiangkingwelcome@vip.qq.com
@Phone: 13816629321
```

---

## 核心原则

### 1. 只读源项目
```
Farm/（Unity）→ 只读参考
FutureFarm/（Cocos）→ 所有修改
```

### 2. 全部使用中文
- 所有回复、注释、文档均使用中文
- 变量名、类名使用英文（符合编程规范）

### 3. 增量开发
- 每次只做一个小任务
- 任务完成后立即可测试
- 保持项目随时可运行

### 4. 文档先行
- 开始任务前先阅读相关文档
- 完成任务后更新 `PROGRESS.md`

---

## 目录结构映射

### 脚本映射

| Unity (C#) | Cocos (TypeScript) |
|------------|-------------------|
| `Assets/Scripts/Common/` | `assets/script/game/common/` |
| `Assets/Scripts/Farm/` | `assets/script/game/farm/` |
| `Assets/Scripts/Factory/` | `assets/script/game/factory/` |
| `Assets/Scripts/Store/` | `assets/script/game/store/` |
| `Assets/Scripts/Town/` | `assets/script/game/town/` |
| `Assets/Scripts/Mission/` | `assets/script/game/mission/` |
| `Assets/Scripts/Menu/` | `assets/script/game/menu/` |
| `Assets/Scripts/Help/` | `assets/script/game/help/` |
| `Assets/Scripts/InApp/` | `assets/script/game/shop/` |

### 资源映射

| Unity | Cocos |
|-------|-------|
| `Assets/Resources/` | `assets/resources/` + `assets/bundle/` |
| `Assets/Images/` | `assets/bundle/gui/` |
| `Assets/Sounds/` | `assets/bundle/audio/` |
| `Assets/Prefabs/` | `assets/bundle/gui/**/*.prefab` |
| `Assets/Animations/` | `assets/bundle/animation/` |
| `Assets/Scenes/` | `assets/scene/` |

### 配置文件映射

| Unity (XML) | Cocos (JSON/Excel) |
|-------------|-------------------|
| `Resources/Mission/DataMission*.xml` | `excel/Mission.xlsx` → `bundle/config/` |
| `Resources/Farm/*.xml` | `excel/Farm.xlsx` |
| `Resources/Factory/*.xml` | `excel/Factory.xlsx` |
| `Resources/Shop/*.xml` | `excel/Shop.xlsx` |
| `Resources/Town/*.xml` | `excel/Town.xlsx` |

---

## 架构规范

### Oops Framework 模式

```
模块结构
assets/script/game/{module}/
├── {Module}.ts              # 实体类（继承 CCEntity）
├── model/
│   └── {Module}Model.ts     # 数据模型组件
├── system/
│   └── {Module}System.ts    # 业务逻辑系统
├── view/
│   └── {Module}ViewComp.ts  # UI视图组件
└── bll/                     # 业务逻辑层（可选）
```

### 实体注册示例

```typescript
// assets/script/game/farm/Farm.ts
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { FarmModel } from "./model/FarmModel";

@ecs.register('Farm')
export class Farm extends CCEntity {
    FarmModel!: FarmModel;

    protected init() {
        this.addComponents<ecs.Comp>(FarmModel);
    }
}
```

### 单例模块注册

```typescript
// assets/script/game/common/SingletonModuleComp.ts
export class smc {
    static account: Account = null!;
    static farm: Farm = null!;      // 新增
    static factory: Factory = null!; // 新增
    static store: Store = null!;     // 新增
    static town: Town = null!;       // 新增
}
```

---

## 代码转换规范

### C# → TypeScript 类型映射

| C# | TypeScript |
|----|-----------|
| `int`, `float`, `double` | `number` |
| `string` | `string` |
| `bool` | `boolean` |
| `List<T>` | `T[]` 或 `Array<T>` |
| `Dictionary<K,V>` | `Map<K,V>` 或 `{[key: K]: V}` |
| `T[]` | `T[]` |
| `T[,]` | `T[][]` |
| `void` | `void` |
| `null` | `null` |
| `Vector3` | `Vec3` |
| `Vector2` | `Vec2` |
| `Color` | `Color` |

### Unity → Cocos 组件映射

| Unity | Cocos Creator |
|-------|--------------|
| `MonoBehaviour` | `Component` |
| `GameObject` | `Node` |
| `Transform` | `Node` (position/rotation/scale) |
| `SpriteRenderer` | `Sprite` |
| `UISprite (NGUI)` | `Sprite` |
| `UILabel (NGUI)` | `Label` |
| `UIButton (NGUI)` | `Button` |
| `UIPanel (NGUI)` | `UITransform` + `Widget` |
| `UIScrollView (NGUI)` | `ScrollView` |
| `Animator` | `Animation` |
| `AudioSource` | `AudioSource` |
| `BoxCollider2D` | `BoxCollider2D` |

### 生命周期映射

| Unity | Cocos Creator |
|-------|--------------|
| `Awake()` | `onLoad()` |
| `Start()` | `start()` |
| `Update()` | `update(dt: number)` |
| `OnEnable()` | `onEnable()` |
| `OnDisable()` | `onDisable()` |
| `OnDestroy()` | `onDestroy()` |

### 常用API映射

```typescript
// Unity                          // Cocos Creator
GameObject.Find("name")           → find("name") 或 getChildByName()
GetComponent<T>()                 → getComponent(T)
Instantiate(prefab)               → instantiate(prefab)
Destroy(obj)                      → obj.destroy()
DontDestroyOnLoad(obj)            → director.addPersistRootNode(node)
PlayerPrefs.GetInt("key")         → sys.localStorage.getItem("key")
Resources.Load("path")            → resources.load("path", callback)
Application.LoadLevel("scene")    → director.loadScene("scene")
Time.deltaTime                    → dt (update参数)
Input.GetMouseButtonDown(0)       → EventTouch
```

---

## 文件命名规范

### 脚本文件

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 实体类 | `{Module}.ts` | `Farm.ts` |
| 数据模型 | `{Module}Model.ts` | `FarmModel.ts` |
| 系统类 | `{Name}System.ts` | `PlantSystem.ts` |
| 视图组件 | `{Name}ViewComp.ts` | `FarmViewComp.ts` |
| 工具类 | `{Name}Utils.ts` | `TimeUtils.ts` |
| 配置类 | `{Name}Config.ts` | `MissionConfig.ts` |
| 事件定义 | `{Module}Event.ts` | `FarmEvent.ts` |

### 资源文件

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 预制体 | 小写下划线 | `farm_field.prefab` |
| 图片 | 小写下划线 | `btn_start.png` |
| 音效 | 小写下划线 | `sfx_click.mp3` |
| 场景 | 驼峰 | `Farm.scene` |

---

## 任务执行流程

### 开始任务前

1. **阅读文档**
   - `CLAUDE.md` - 项目指南
   - `MIGRATION_PLAN.md` - 移植方案
   - `PROGRESS.md` - 当前进度

2. **确认任务**
   - 明确任务编号（如 1.2.4）
   - 确认依赖任务已完成
   - 确认输出文件路径

3. **查看Unity源码**
   - 找到对应的Unity源文件
   - 理解逻辑后再编写Cocos代码

### 执行任务中

1. **增量开发**
   - 每次只修改一个文件
   - 写完立即验证

2. **代码规范**
   - 添加文件头注释（作者信息）
   - 添加必要的行内注释
   - 遵循TypeScript最佳实践

3. **测试验证**
   - 确保编译无错误
   - 验证功能正确

### 完成任务后

1. **更新进度**
   - 更新 `PROGRESS.md`
   - 标记任务状态

2. **记录问题**
   - 遇到的问题记录在 `ISSUES.md`
   - 临时解决方案要标注 TODO

---

## 当前阶段任务

参考 `MIGRATION_PLAN.md` 中的任务列表。

**快速启动路径（MVP）**：
```
1.1.1 配置管理器 → 1.1.2 XML转JSON → 1.1.3 关卡配置加载器
    ↓
1.2.1 基础数据类 → 1.2.2 任务数据 → 1.2.4 农场数据
    ↓
2.1.1 农场实体 → 2.1.2 农场数据组件
    ↓
2.2.1 种植系统 → 2.2.3 收获系统
    ↓
2.3.1 农场场景 → 2.3.2 农场主界面 → 2.3.3 田地组件
    ↓
可运行的农场原型！
```

---

## 通信规范

### AI间协作

当多个AI工具同时工作时：

1. **任务分配**
   - 按模块分配，避免冲突
   - 一个模块同时只有一个AI在修改

2. **进度同步**
   - 完成任务后立即更新 `PROGRESS.md`
   - 冲突时以文档为准

3. **代码审查**
   - 完成的代码需要另一个AI审查
   - 审查通过后标记为 ✅

### 问题上报

遇到问题时：
1. 先尝试自行解决
2. 解决不了则记录在 `ISSUES.md`
3. 标注问题级别（Critical/Major/Minor）

---

## 检查清单

### 每次开发检查

- [ ] 是否阅读了相关Unity源码？
- [ ] 是否遵循了目录结构规范？
- [ ] 是否遵循了命名规范？
- [ ] 是否添加了必要注释？
- [ ] 代码是否可以编译通过？
- [ ] 功能是否可以正常运行？
- [ ] 是否更新了进度文档？

### 代码质量检查

- [ ] 无硬编码的魔法数字
- [ ] 无重复代码
- [ ] 错误处理完善
- [ ] 资源正确释放
- [ ] 事件正确注销

---

## 相关文档

| 文档 | 说明 | 必读级别 |
|------|------|----------|
| `CLAUDE.md` | 项目指南（入口文档） | ⭐⭐⭐ |
| `OOPS_FRAMEWORK_GUIDE.md` | **Oops框架使用规范** | ⭐⭐⭐ |
| `TASK_EXECUTION_MANUAL.md` | **详细任务执行手册** | ⭐⭐⭐ |
| `MIGRATION_PLAN.md` | 移植方案和任务列表 | ⭐⭐⭐ |
| `PROGRESS.md` | 当前进度记录 | ⭐⭐⭐ |
| `TOOLS_GUIDE.md` | **迁移工具使用指南** | ⭐⭐ |
| `CODE_CONVERSION_GUIDE.md` | 代码转换详细规范 | ⭐⭐ |
| `ASSET_CONVERSION_GUIDE.md` | 资源转换详细规范 | ⭐⭐ |
| `UNITY_PROJECT_ANALYSIS.md` | Unity项目分析报告 | ⭐ |
| `MIGRATION_PLAN_SMALL_STEPS.md` | 详细小步骤方案 | ⭐ |
| `ISSUES.md` | 问题记录 | ⭐ |

**重要提示**：
- 编写代码前必须阅读 `OOPS_FRAMEWORK_GUIDE.md`，了解框架的 ECS 模式和使用规范
- 执行任务前必须阅读 `TASK_EXECUTION_MANUAL.md`，获取完整的代码模板和步骤
- 转换资源前必须阅读 `TOOLS_GUIDE.md`，了解工具使用方法

---

*最后更新：2025-01-07*
