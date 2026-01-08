# 详细任务执行手册

## 说明

本文档提供**逐行代码级别**的详细任务指南。每个任务都包含：
- 完整的代码模板
- 具体的文件路径
- 验证步骤
- 常见错误处理

---

## 当前进度

- ✅ Sprint 0: Logo → Loading → Menu 流程已完成
- ⏳ **Sprint 1: 配置系统** ← 当前
- 🔜 Sprint 2: 数据模型
- 🔜 Sprint 3: 农场模块

---

# Sprint 1: 配置系统

## 任务 1.1.1: 创建作物配置 JSON

### 目标
将 Unity 的 `ElementFarm.xml` 转换为 JSON 格式

### Unity 原始数据
```xml
<!-- Assets/Resources/Farm/XMLFile/ElementFarm.xml -->
<FarmElement level="1">
  <Element id="1" name="wheat" price="20" timeGrowup="102" yield="3-5-7-9"/>
  <Element id="2" name="tomato" price="25" timeGrowup="102" yield="3-5-7-9"/>
  <Element id="3" name="grapes" price="26" timeGrowup="102" yield="3-5-7-9"/>
  <Element id="4" name="strawberry" price="27" timeGrowup="102" yield="3-5-7-9"/>
  <Element id="5" name="chicken" price="31" timeGrowup="108" yield="3-5-7-9"/>
  <Element id="6" name="pig" price="29" timeGrowup="108" yield="3-5-7-9"/>
  <Element id="7" name="cow" price="30" timeGrowup="108" yield="3-5-7-9"/>
  <Element id="8" name="fish" price="29" timeGrowup="108" yield="3-5-7-9"/>
  <Element id="9" name="shrimp" price="30" timeGrowup="108" yield="3-5-7-9"/>
</FarmElement>
```

### 步骤 1.1.1.1: 创建目录结构

```bash
# 在 FutureFarm 项目中创建目录
assets/bundle/config/farm/
```

### 步骤 1.1.1.2: 创建 crops.json

**文件路径**: `assets/bundle/config/farm/crops.json`

```json
{
  "version": "1.0",
  "description": "作物/动物基础配置",
  "crops": [
    {
      "id": 1,
      "key": "wheat",
      "name": "小麦",
      "nameEn": "Wheat",
      "type": "plant",
      "category": "field",
      "price": 20,
      "growTime": 102,
      "yields": [3, 5, 7, 9],
      "icon": "crop_wheat",
      "stages": ["seed", "sprout", "mature"]
    },
    {
      "id": 2,
      "key": "tomato",
      "name": "番茄",
      "nameEn": "Tomato",
      "type": "plant",
      "category": "field",
      "price": 25,
      "growTime": 102,
      "yields": [3, 5, 7, 9],
      "icon": "crop_tomato",
      "stages": ["seed", "sprout", "mature"]
    },
    {
      "id": 3,
      "key": "grapes",
      "name": "葡萄",
      "nameEn": "Grapes",
      "type": "plant",
      "category": "field",
      "price": 26,
      "growTime": 102,
      "yields": [3, 5, 7, 9],
      "icon": "crop_grapes",
      "stages": ["seed", "sprout", "mature"]
    },
    {
      "id": 4,
      "key": "strawberry",
      "name": "草莓",
      "nameEn": "Strawberry",
      "type": "plant",
      "category": "field",
      "price": 27,
      "growTime": 102,
      "yields": [3, 5, 7, 9],
      "icon": "crop_strawberry",
      "stages": ["seed", "sprout", "mature"]
    },
    {
      "id": 5,
      "key": "chicken",
      "name": "鸡",
      "nameEn": "Chicken",
      "type": "animal",
      "category": "cage",
      "price": 31,
      "growTime": 108,
      "yields": [3, 5, 7, 9],
      "icon": "animal_chicken",
      "stages": ["baby", "growing", "adult"]
    },
    {
      "id": 6,
      "key": "pig",
      "name": "猪",
      "nameEn": "Pig",
      "type": "animal",
      "category": "cage",
      "price": 29,
      "growTime": 108,
      "yields": [3, 5, 7, 9],
      "icon": "animal_pig",
      "stages": ["baby", "growing", "adult"]
    },
    {
      "id": 7,
      "key": "cow",
      "name": "牛",
      "nameEn": "Cow",
      "type": "animal",
      "category": "cage",
      "price": 30,
      "growTime": 108,
      "yields": [3, 5, 7, 9],
      "icon": "animal_cow",
      "stages": ["baby", "growing", "adult"]
    },
    {
      "id": 8,
      "key": "fish",
      "name": "鱼",
      "nameEn": "Fish",
      "type": "animal",
      "category": "pond",
      "price": 29,
      "growTime": 108,
      "yields": [3, 5, 7, 9],
      "icon": "animal_fish",
      "stages": ["baby", "growing", "adult"]
    },
    {
      "id": 9,
      "key": "shrimp",
      "name": "虾",
      "nameEn": "Shrimp",
      "type": "animal",
      "category": "pond",
      "price": 30,
      "growTime": 108,
      "yields": [3, 5, 7, 9],
      "icon": "animal_shrimp",
      "stages": ["baby", "growing", "adult"]
    }
  ]
}
```

### 步骤 1.1.1.3: 创建 .meta 文件

Cocos Creator 会自动生成，无需手动创建。

### 验证步骤
1. 在 Cocos Creator 中打开项目
2. 查看 `assets/bundle/config/farm/` 目录
3. 确认 `crops.json` 文件存在且格式正确

---

## 任务 1.1.2: 创建关卡配置 JSON

### 目标
将 Unity 的 `DataMission1.xml` 转换为 JSON 格式

### Unity 原始数据
```xml
<!-- Assets/Resources/Mission/DataMission1.xml -->
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
  <City></City>
</Missions>
```

### 步骤 1.1.2.1: 创建目录

```bash
assets/bundle/config/mission/
```

### 步骤 1.1.2.2: 创建 mission_1.json

**文件路径**: `assets/bundle/config/mission/mission_1.json`

```json
{
  "id": 1,
  "name": "第一关",
  "description": "学习基础种植",

  "target": {
    "startMoney": 500,
    "timeMission": 7,
    "maxDays": 7
  },

  "star": {
    "oneStar": 0,
    "twoStar": 100,
    "threeStar": 200,
    "rewards": [1, 2, 3]
  },

  "farm": {
    "fields": [
      {
        "id": 1,
        "type": "field",
        "startNumber": 2,
        "targetNumber": 0,
        "startLevel": 1,
        "targetLevel": 1,
        "maxLevel": 1
      }
    ],
    "crops": [
      {
        "id": 1,
        "cropId": 1,
        "targetPlant": 1,
        "startNumber": 0
      }
    ],
    "canSick": false
  },

  "factory": {
    "countPosition": 2,
    "machines": [
      {
        "id": 1,
        "machineId": 1,
        "level": 1
      }
    ]
  },

  "shop": {
    "products": [
      {
        "id": 1,
        "productId": 7,
        "targetProduction": 1
      }
    ]
  },

  "town": {
    "buildings": []
  }
}
```

### 步骤 1.1.2.3: 创建关卡索引文件

**文件路径**: `assets/bundle/config/mission/mission_index.json`

```json
{
  "version": "1.0",
  "totalMissions": 50,
  "missions": [
    { "id": 1, "file": "mission_1", "unlocked": true },
    { "id": 2, "file": "mission_2", "unlocked": false },
    { "id": 3, "file": "mission_3", "unlocked": false }
  ]
}
```

### 验证步骤
1. 确认 JSON 格式正确（无语法错误）
2. 在 Cocos Creator 中查看文件

---

## 任务 1.1.3: 创建配置管理器

### 目标
创建 TypeScript 类来加载和管理配置数据

### 步骤 1.1.3.1: 创建目录

```bash
assets/script/game/common/config/data/
```

### 步骤 1.1.3.2: 创建作物配置类型定义

**文件路径**: `assets/script/game/common/config/data/CropConfigData.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 作物配置数据类型定义
 */

/** 作物类型 */
export type CropType = 'plant' | 'animal';

/** 作物分类 */
export type CropCategory = 'field' | 'cage' | 'pond';

/** 单个作物配置 */
export interface ICropConfig {
    /** 作物ID */
    id: number;
    /** 作物键名 */
    key: string;
    /** 中文名称 */
    name: string;
    /** 英文名称 */
    nameEn: string;
    /** 类型：植物/动物 */
    type: CropType;
    /** 分类：田地/笼子/池塘 */
    category: CropCategory;
    /** 购买价格 */
    price: number;
    /** 生长时间（秒） */
    growTime: number;
    /** 各等级产量 [等级1, 等级2, 等级3, 等级4] */
    yields: number[];
    /** 图标资源名 */
    icon: string;
    /** 生长阶段名称 */
    stages: string[];
}

/** 作物配置文件结构 */
export interface ICropConfigFile {
    version: string;
    description: string;
    crops: ICropConfig[];
}
```

### 步骤 1.1.3.3: 创建关卡配置类型定义

**文件路径**: `assets/script/game/common/config/data/MissionConfigData.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 关卡配置数据类型定义
 */

/** 关卡目标配置 */
export interface IMissionTarget {
    /** 初始金钱 */
    startMoney: number;
    /** 任务时间（天） */
    timeMission: number;
    /** 最大天数 */
    maxDays: number;
}

/** 星级评价配置 */
export interface IMissionStar {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    rewards: number[];
}

/** 田地配置 */
export interface IFieldConfig {
    id: number;
    type: string;
    startNumber: number;
    targetNumber: number;
    startLevel: number;
    targetLevel: number;
    maxLevel: number;
}

/** 作物目标配置 */
export interface ICropTargetConfig {
    id: number;
    cropId: number;
    targetPlant: number;
    startNumber: number;
}

/** 农场关卡配置 */
export interface IFarmMissionConfig {
    fields: IFieldConfig[];
    crops: ICropTargetConfig[];
    canSick: boolean;
}

/** 机器配置 */
export interface IMachineConfig {
    id: number;
    machineId: number;
    level: number;
}

/** 工厂关卡配置 */
export interface IFactoryMissionConfig {
    countPosition: number;
    machines: IMachineConfig[];
}

/** 产品目标配置 */
export interface IProductTargetConfig {
    id: number;
    productId: number;
    targetProduction: number;
}

/** 商店关卡配置 */
export interface IShopMissionConfig {
    products: IProductTargetConfig[];
}

/** 城镇关卡配置 */
export interface ITownMissionConfig {
    buildings: any[];
}

/** 完整关卡配置 */
export interface IMissionConfig {
    id: number;
    name: string;
    description: string;
    target: IMissionTarget;
    star: IMissionStar;
    farm: IFarmMissionConfig;
    factory: IFactoryMissionConfig;
    shop: IShopMissionConfig;
    town: ITownMissionConfig;
}

/** 关卡索引项 */
export interface IMissionIndexItem {
    id: number;
    file: string;
    unlocked: boolean;
}

/** 关卡索引文件结构 */
export interface IMissionIndexFile {
    version: string;
    totalMissions: number;
    missions: IMissionIndexItem[];
}
```

### 步骤 1.1.3.4: 创建配置管理器

**文件路径**: `assets/script/game/common/config/ConfigManager.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 游戏配置管理器
 */

import { JsonAsset } from 'cc';
import { oops } from "db://oops-framework/core/Oops";
import { ICropConfig, ICropConfigFile } from './data/CropConfigData';
import { IMissionConfig, IMissionIndexFile } from './data/MissionConfigData';

/** 配置管理器 - 单例 */
export class ConfigManager {
    private static _instance: ConfigManager;

    /** 获取单例 */
    public static get instance(): ConfigManager {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }

    /** 作物配置缓存 */
    private _cropConfigs: Map<number, ICropConfig> = new Map();

    /** 关卡配置缓存 */
    private _missionConfigs: Map<number, IMissionConfig> = new Map();

    /** 关卡索引 */
    private _missionIndex: IMissionIndexFile | null = null;

    /** 是否已初始化 */
    private _initialized: boolean = false;

    private constructor() {}

    /**
     * 初始化配置管理器
     * @param onComplete 完成回调
     */
    public async init(onComplete?: () => void): Promise<void> {
        if (this._initialized) {
            onComplete?.();
            return;
        }

        console.log('[ConfigManager] 开始加载配置...');

        try {
            // 加载作物配置
            await this.loadCropConfig();

            // 加载关卡索引
            await this.loadMissionIndex();

            this._initialized = true;
            console.log('[ConfigManager] 配置加载完成');
            onComplete?.();
        } catch (error) {
            console.error('[ConfigManager] 配置加载失败:', error);
            onComplete?.();
        }
    }

    /** 加载作物配置 */
    private loadCropConfig(): Promise<void> {
        return new Promise((resolve, reject) => {
            oops.res.load('config/farm/crops', JsonAsset, (err, asset) => {
                if (err) {
                    console.error('[ConfigManager] 加载作物配置失败:', err);
                    reject(err);
                    return;
                }

                const data = asset.json as ICropConfigFile;
                console.log(`[ConfigManager] 加载了 ${data.crops.length} 个作物配置`);

                // 缓存到 Map
                for (const crop of data.crops) {
                    this._cropConfigs.set(crop.id, crop);
                }

                resolve();
            });
        });
    }

    /** 加载关卡索引 */
    private loadMissionIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            oops.res.load('config/mission/mission_index', JsonAsset, (err, asset) => {
                if (err) {
                    console.error('[ConfigManager] 加载关卡索引失败:', err);
                    reject(err);
                    return;
                }

                this._missionIndex = asset.json as IMissionIndexFile;
                console.log(`[ConfigManager] 关卡总数: ${this._missionIndex.totalMissions}`);

                resolve();
            });
        });
    }

    /**
     * 加载指定关卡配置
     * @param missionId 关卡ID
     */
    public async loadMissionConfig(missionId: number): Promise<IMissionConfig | null> {
        // 检查缓存
        if (this._missionConfigs.has(missionId)) {
            return this._missionConfigs.get(missionId)!;
        }

        // 查找关卡文件名
        const indexItem = this._missionIndex?.missions.find(m => m.id === missionId);
        if (!indexItem) {
            console.error(`[ConfigManager] 找不到关卡 ${missionId}`);
            return null;
        }

        return new Promise((resolve, reject) => {
            const path = `config/mission/${indexItem.file}`;
            oops.res.load(path, JsonAsset, (err, asset) => {
                if (err) {
                    console.error(`[ConfigManager] 加载关卡 ${missionId} 失败:`, err);
                    resolve(null);
                    return;
                }

                const config = asset.json as IMissionConfig;
                this._missionConfigs.set(missionId, config);
                console.log(`[ConfigManager] 加载关卡 ${missionId}: ${config.name}`);

                resolve(config);
            });
        });
    }

    // ============ 获取配置接口 ============

    /**
     * 获取作物配置
     * @param cropId 作物ID
     */
    public getCropConfig(cropId: number): ICropConfig | undefined {
        return this._cropConfigs.get(cropId);
    }

    /**
     * 获取所有作物配置
     */
    public getAllCropConfigs(): ICropConfig[] {
        return Array.from(this._cropConfigs.values());
    }

    /**
     * 按类型获取作物
     * @param type 作物类型
     */
    public getCropsByType(type: 'plant' | 'animal'): ICropConfig[] {
        return this.getAllCropConfigs().filter(c => c.type === type);
    }

    /**
     * 按分类获取作物
     * @param category 分类
     */
    public getCropsByCategory(category: 'field' | 'cage' | 'pond'): ICropConfig[] {
        return this.getAllCropConfigs().filter(c => c.category === category);
    }

    /**
     * 获取关卡配置
     * @param missionId 关卡ID
     */
    public getMissionConfig(missionId: number): IMissionConfig | undefined {
        return this._missionConfigs.get(missionId);
    }

    /**
     * 获取关卡索引
     */
    public getMissionIndex(): IMissionIndexFile | null {
        return this._missionIndex;
    }

    /**
     * 检查关卡是否解锁
     * @param missionId 关卡ID
     */
    public isMissionUnlocked(missionId: number): boolean {
        const item = this._missionIndex?.missions.find(m => m.id === missionId);
        return item?.unlocked ?? false;
    }
}

/** 配置管理器快捷访问 */
export const configMgr = ConfigManager.instance;
```

### 步骤 1.1.3.5: 在初始化流程中加载配置

**修改文件**: `assets/script/game/initialize/bll/InitRes.ts`

在 `loadCommon` 方法后添加配置加载：

```typescript
// 在 import 部分添加
import { configMgr } from "../../common/config/ConfigManager";

// 在 loadCommon 方法后添加新方法
/** 加载游戏配置 */
private loadGameConfig(queue: AsyncQueue) {
    queue.push(async (next: NextFunction) => {
        console.log('[InitRes] 加载游戏配置...');
        await configMgr.init();
        next();
    });
}

// 在 entityEnter 方法中调用（在 loadCommon 后）
this.loadCommon(queue);
this.loadGameConfig(queue);  // 添加这行
this.onComplete(queue, e);
```

### 验证步骤

1. **编译检查**
   - 打开 Cocos Creator
   - 查看控制台是否有 TypeScript 编译错误

2. **运行测试**
   - 运行游戏
   - 查看控制台日志：
     ```
     [ConfigManager] 开始加载配置...
     [ConfigManager] 加载了 9 个作物配置
     [ConfigManager] 关卡总数: 50
     [ConfigManager] 配置加载完成
     ```

3. **功能验证**
   - 在 MenuViewComp 中添加测试代码：
   ```typescript
   import { configMgr } from "../../common/config/ConfigManager";

   start() {
       // 测试获取作物配置
       const wheat = configMgr.getCropConfig(1);
       console.log('小麦配置:', wheat);

       // 测试获取所有植物
       const plants = configMgr.getCropsByType('plant');
       console.log('植物数量:', plants.length);
   }
   ```

---

## 任务 1.1.4: 加载第一关配置测试

### 目标
验证关卡配置加载功能

### 步骤 1.1.4.1: 创建测试代码

在 `MenuViewComp.ts` 的 `onStartGame` 方法中添加：

```typescript
private async onStartGame(): Promise<void> {
    console.log('[MenuView] 点击开始游戏');

    // 加载第一关配置
    const mission = await configMgr.loadMissionConfig(1);
    if (mission) {
        console.log('=== 关卡配置 ===');
        console.log('关卡名称:', mission.name);
        console.log('初始金钱:', mission.target.startMoney);
        console.log('任务天数:', mission.target.timeMission);
        console.log('田地数量:', mission.farm.fields.length);
        console.log('作物目标:', mission.farm.crops);
    }

    // TODO: 进入农场界面
}
```

### 验证步骤

1. 运行游戏
2. 点击开始按钮
3. 查看控制台输出：
   ```
   === 关卡配置 ===
   关卡名称: 第一关
   初始金钱: 500
   任务天数: 7
   田地数量: 1
   作物目标: [{id: 1, cropId: 1, targetPlant: 1, startNumber: 0}]
   ```

---

# Sprint 2: 数据模型

## 任务 1.2.1: 创建农场数据模型

### 目标
创建农场模块的 ECS 实体和数据组件

### 步骤 1.2.1.1: 创建目录结构

```bash
assets/script/game/farm/
├── Farm.ts                    # 农场实体
├── model/
│   └── FarmModelComp.ts      # 农场数据组件
├── system/                    # 系统（后续创建）
└── view/                      # 视图（后续创建）
```

### 步骤 1.2.1.2: 创建作物数据类

**文件路径**: `assets/script/game/farm/model/CropData.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 作物运行时数据
 */

/** 作物状态 */
export enum CropStatus {
    /** 正常 */
    Normal = 'normal',
    /** 生病 */
    Sick = 'sick',
    /** 治疗中 */
    Healing = 'healing'
}

/** 作物生长阶段 */
export enum CropStage {
    /** 种子/幼崽 */
    Seed = 1,
    /** 生长中 */
    Growing = 2,
    /** 成熟 */
    Mature = 3
}

/**
 * 作物运行时数据
 * 对应 Unity: Assets/Scripts/Farm/Breed.cs
 */
export class CropData {
    /** 作物配置ID */
    cropId: number = 0;

    /** 作物名称 */
    name: string = '';

    /** 当前生长时间（秒） */
    growTime: number = 0;

    /** 最大生长时间（秒） */
    maxGrowTime: number = 10;

    /** 产量 */
    yield: number = 0;

    /** 状态 */
    status: CropStatus = CropStatus.Normal;

    /** 生长阶段 */
    stage: CropStage = CropStage.Seed;

    /** 购买价格 */
    price: number = 0;

    /** 治疗时间（秒） */
    healingTime: number = 5;

    /** 当前治疗时间 */
    currentHealingTime: number = 0;

    constructor(cropId: number = 0) {
        this.cropId = cropId;
    }

    /** 重置数据 */
    reset(): void {
        this.cropId = 0;
        this.name = '';
        this.growTime = 0;
        this.maxGrowTime = 10;
        this.yield = 0;
        this.status = CropStatus.Normal;
        this.stage = CropStage.Seed;
        this.price = 0;
        this.healingTime = 5;
        this.currentHealingTime = 0;
    }

    /** 是否为空（未种植） */
    isEmpty(): boolean {
        return this.cropId === 0;
    }

    /** 是否成熟 */
    isMature(): boolean {
        return this.stage === CropStage.Mature;
    }

    /** 是否生病 */
    isSick(): boolean {
        return this.status === CropStatus.Sick;
    }

    /** 获取生长进度 (0-1) */
    getGrowthProgress(): number {
        if (this.maxGrowTime <= 0) return 0;
        return Math.min(1, this.growTime / this.maxGrowTime);
    }
}
```

### 步骤 1.2.1.3: 创建田地数据类

**文件路径**: `assets/script/game/farm/model/FieldData.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 田地运行时数据
 */

import { CropData } from './CropData';

/** 田地类型 */
export enum FieldType {
    /** 农田（种植作物） */
    Field = 1,
    /** 笼子（饲养动物） */
    Cage = 2,
    /** 池塘（养鱼虾） */
    Pond = 3
}

/**
 * 田地运行时数据
 * 对应 Unity: Assets/Scripts/Farm/FarmDataMission.cs -> FieldFarm
 */
export class FieldData {
    /** 田地索引 */
    index: number = 0;

    /** 田地类型 */
    type: FieldType = FieldType.Field;

    /** 当前等级 */
    level: number = 1;

    /** 最大等级 */
    maxLevel: number = 3;

    /** 格子数量（可种植位置） */
    slotCount: number = 4;

    /** 格子中的作物数据 */
    crops: CropData[] = [];

    /** 是否解锁 */
    unlocked: boolean = true;

    constructor(index: number = 0, type: FieldType = FieldType.Field) {
        this.index = index;
        this.type = type;
        this.initSlots();
    }

    /** 初始化格子 */
    private initSlots(): void {
        this.crops = [];
        for (let i = 0; i < this.slotCount; i++) {
            this.crops.push(new CropData());
        }
    }

    /** 重置数据 */
    reset(): void {
        this.level = 1;
        for (const crop of this.crops) {
            crop.reset();
        }
    }

    /** 获取空闲格子索引，-1表示没有空位 */
    getEmptySlotIndex(): number {
        for (let i = 0; i < this.crops.length; i++) {
            if (this.crops[i].isEmpty()) {
                return i;
            }
        }
        return -1;
    }

    /** 是否有空位 */
    hasEmptySlot(): boolean {
        return this.getEmptySlotIndex() >= 0;
    }

    /** 获取成熟作物数量 */
    getMatureCropCount(): number {
        return this.crops.filter(c => c.isMature()).length;
    }

    /** 获取生病作物数量 */
    getSickCropCount(): number {
        return this.crops.filter(c => c.isSick()).length;
    }
}
```

### 步骤 1.2.1.4: 创建农场数据组件

**文件路径**: `assets/script/game/farm/model/FarmModelComp.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 农场数据组件
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { FieldData, FieldType } from "./FieldData";
import { CropData } from "./CropData";

/**
 * 农场数据组件
 * 管理所有田地和作物数据
 */
@ecs.register('FarmModel')
export class FarmModelComp extends ecs.Comp {

    /** 农田列表 */
    fields: FieldData[] = [];

    /** 笼子列表 */
    cages: FieldData[] = [];

    /** 池塘列表 */
    ponds: FieldData[] = [];

    /** 当前关卡ID */
    currentMissionId: number = 0;

    /** 是否允许生病 */
    canSick: boolean = false;

    /** 收获统计 - 田地作物 */
    harvestFieldCount: number = 0;

    /** 收获统计 - 笼子动物 */
    harvestCageCount: number = 0;

    /** 重置组件 */
    reset(): void {
        this.fields = [];
        this.cages = [];
        this.ponds = [];
        this.currentMissionId = 0;
        this.canSick = false;
        this.harvestFieldCount = 0;
        this.harvestCageCount = 0;
    }

    /**
     * 初始化农场数据
     * @param fieldCount 农田数量
     * @param cageCount 笼子数量
     * @param pondCount 池塘数量
     */
    initFields(fieldCount: number, cageCount: number = 0, pondCount: number = 0): void {
        this.fields = [];
        this.cages = [];
        this.ponds = [];

        for (let i = 0; i < fieldCount; i++) {
            this.fields.push(new FieldData(i, FieldType.Field));
        }
        for (let i = 0; i < cageCount; i++) {
            this.cages.push(new FieldData(i, FieldType.Cage));
        }
        for (let i = 0; i < pondCount; i++) {
            this.ponds.push(new FieldData(i, FieldType.Pond));
        }

        console.log(`[FarmModel] 初始化: ${fieldCount}块农田, ${cageCount}个笼子, ${pondCount}个池塘`);
    }

    /**
     * 获取所有田地（包括农田、笼子、池塘）
     */
    getAllFields(): FieldData[] {
        return [...this.fields, ...this.cages, ...this.ponds];
    }

    /**
     * 根据类型获取田地
     */
    getFieldsByType(type: FieldType): FieldData[] {
        switch (type) {
            case FieldType.Field: return this.fields;
            case FieldType.Cage: return this.cages;
            case FieldType.Pond: return this.ponds;
            default: return [];
        }
    }

    /**
     * 获取指定田地
     */
    getField(type: FieldType, index: number): FieldData | null {
        const fields = this.getFieldsByType(type);
        return fields[index] ?? null;
    }

    /**
     * 获取所有成熟作物
     */
    getAllMatureCrops(): { field: FieldData, slotIndex: number, crop: CropData }[] {
        const result: { field: FieldData, slotIndex: number, crop: CropData }[] = [];

        for (const field of this.getAllFields()) {
            for (let i = 0; i < field.crops.length; i++) {
                if (field.crops[i].isMature()) {
                    result.push({ field, slotIndex: i, crop: field.crops[i] });
                }
            }
        }

        return result;
    }

    /**
     * 获取所有生病作物
     */
    getAllSickCrops(): { field: FieldData, slotIndex: number, crop: CropData }[] {
        const result: { field: FieldData, slotIndex: number, crop: CropData }[] = [];

        for (const field of this.getAllFields()) {
            for (let i = 0; i < field.crops.length; i++) {
                if (field.crops[i].isSick()) {
                    result.push({ field, slotIndex: i, crop: field.crops[i] });
                }
            }
        }

        return result;
    }
}
```

### 步骤 1.2.1.5: 创建农场实体

**文件路径**: `assets/script/game/farm/Farm.ts`

```typescript
/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-07
 * @Description: 农场模块实体
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { FarmModelComp } from "./model/FarmModelComp";

/**
 * 农场模块实体
 * 管理农场相关的所有组件和系统
 */
@ecs.register('Farm')
export class Farm extends CCEntity {
    /** 农场数据组件 */
    FarmModel!: FarmModelComp;

    protected init(): void {
        this.addComponents<ecs.Comp>(FarmModelComp);
    }
}
```

### 步骤 1.2.1.6: 注册到单例模块

**修改文件**: `assets/script/game/common/SingletonModuleComp.ts`

```typescript
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Account } from "../account/Account";
import type { Initialize } from "../initialize/Initialize";
import type { Farm } from "../farm/Farm";  // 添加

@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    initialize: Initialize = null!;
    account: Account = null!;
    farm: Farm = null!;  // 添加

    reset() { }
}

export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);
```

### 步骤 1.2.1.7: 在 Main.ts 中初始化

**修改文件**: `assets/script/Main.ts`

```typescript
// 在 import 部分添加
import { Farm } from './game/farm/Farm';

// 在 run() 方法中添加
protected run() {
    smc.initialize = ecs.getEntity<Initialize>(Initialize);
    smc.account = ecs.getEntity<Account>(Account);
    smc.farm = ecs.getEntity<Farm>(Farm);  // 添加
    console.log('[Main] Main initialization completed');
}
```

### 验证步骤

1. **编译检查**
   - 确保无 TypeScript 错误

2. **运行测试**
   - 在 MenuViewComp 中添加测试：
   ```typescript
   import { smc } from "../../common/SingletonModuleComp";

   private onStartGame(): void {
       // 测试农场模块
       console.log('农场模块:', smc.farm);
       console.log('农场数据:', smc.farm.FarmModel);

       // 初始化测试
       smc.farm.FarmModel.initFields(3, 2, 1);
       console.log('农田数量:', smc.farm.FarmModel.fields.length);
   }
   ```

3. **预期输出**
   ```
   农场模块: Farm {...}
   农场数据: FarmModelComp {...}
   [FarmModel] 初始化: 3块农田, 2个笼子, 1个池塘
   农田数量: 3
   ```

---

# 任务检查清单

## Sprint 1 检查清单

- [ ] 1.1.1 创建 `crops.json` 作物配置
- [ ] 1.1.2 创建 `mission_1.json` 关卡配置
- [ ] 1.1.3 创建 `ConfigManager.ts` 配置管理器
- [ ] 1.1.4 测试配置加载功能

## Sprint 2 检查清单

- [ ] 1.2.1 创建 `CropData.ts` 作物数据类
- [ ] 1.2.2 创建 `FieldData.ts` 田地数据类
- [ ] 1.2.3 创建 `FarmModelComp.ts` 农场数据组件
- [ ] 1.2.4 创建 `Farm.ts` 农场实体
- [ ] 1.2.5 注册到 `SingletonModuleComp`
- [ ] 1.2.6 在 `Main.ts` 中初始化
- [ ] 1.2.7 验证测试

---

*最后更新：2025-01-07*
