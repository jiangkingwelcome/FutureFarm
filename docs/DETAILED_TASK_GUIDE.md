# 超详细任务执行指南

## 说明

本文档提供**逐行代码级别**的超详细任务指南。每个任务都包含：
- ✅ 任务目标
- 📋 前置条件检查
- 🔍 Unity源码参考位置
- 📝 详细步骤（每个步骤都有具体操作）
- 💻 完整代码示例
- ✅ 验证方法
- ⚠️ 常见问题处理

## ⚠️ 重要规则

### 测试文件规范

**测试文件必须放在 `assets/script/test/` 目录下，禁止与源代码放在同一目录！**

- ✅ **正确**：`assets/script/test/config/ConfigManagerTest.ts`
- ❌ **错误**：`assets/script/game/common/config/ConfigManagerTest.ts`

测试文件目录结构应与源代码目录结构对应：
- 源代码：`assets/script/game/common/config/ConfigManager.ts`
- 测试文件：`assets/script/test/config/ConfigManagerTest.ts`

导入路径使用相对路径：`../../game/common/config/ConfigManager`

---

## 当前进度

- ✅ Sprint 0: Logo → Loading → Menu 流程已完成
- ⏳ **Sprint 1: 配置系统** ← 当前从这里开始
- 🔜 Sprint 2: 数据模型
- 🔜 Sprint 3: 农场模块

---

# Sprint 1: 配置系统

## 任务 1.1.1: 创建配置管理器基类

### 📋 前置条件检查

- [ ] 确认项目已初始化 Oops Framework
- [ ] 确认目录 `assets/script/game/common/config/` 存在（不存在则创建）
- [ ] 确认已阅读 `CODE_CONVERSION_GUIDE.md` 了解 TypeScript 规范

### 🔍 Unity源码参考

**无需参考Unity源码** - 这是新设计的配置管理器

### 📝 详细步骤

#### 步骤 1.1.1.1: 创建目录结构

**操作**：
1. 在 `FutureFarm` 项目根目录下
2. 创建目录：`assets/script/game/common/config/`
3. 如果目录已存在，跳过此步骤

**验证**：
```bash
# Windows PowerShell
Test-Path "assets/script/game/common/config"

# 应该返回 True
```

#### 步骤 1.1.1.2: 创建 ConfigManager.ts 文件

**文件路径**: `assets/script/game/common/config/ConfigManager.ts`

**操作**：
1. 在编辑器中创建新文件
2. 复制以下完整代码

**完整代码**：

```typescript
/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 配置管理器基类
 * 提供统一的配置加载、缓存、验证机制
 */

import { resources, JsonAsset } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';

/**
 * 配置管理器基类
 * 所有配置加载器都应继承此类
 */
export abstract class ConfigManager<T> {
    /** 配置数据缓存 */
    protected _cache: Map<string, T> = new Map();
    
    /** 配置文件路径前缀 */
    protected abstract getConfigPath(): string;
    
    /**
     * 加载单个配置
     * @param key 配置键（文件名，不含扩展名）
     * @returns Promise<T> 配置数据
     */
    async load(key: string): Promise<T> {
        // 检查缓存
        if (this._cache.has(key)) {
            return this._cache.get(key)!;
        }
        
        // 构建完整路径
        const fullPath = `${this.getConfigPath()}/${key}`;
        
        return new Promise<T>((resolve, reject) => {
            resources.load(fullPath, JsonAsset, (err: Error | null, asset: JsonAsset | null) => {
                if (err) {
                    console.error(`[ConfigManager] 加载配置失败: ${fullPath}`, err);
                    reject(err);
                    return;
                }
                
                if (!asset || !asset.json) {
                    const error = new Error(`配置文件为空: ${fullPath}`);
                    console.error(`[ConfigManager]`, error);
                    reject(error);
                    return;
                }
                
                // 验证配置数据
                const config = this.validate(asset.json as T, key);
                
                // 存入缓存
                this._cache.set(key, config);
                
                console.log(`[ConfigManager] 加载配置成功: ${fullPath}`);
                resolve(config);
            });
        });
    }
    
    /**
     * 批量加载配置
     * @param keys 配置键数组
     * @returns Promise<Map<string, T>> 配置数据映射
     */
    async loadBatch(keys: string[]): Promise<Map<string, T>> {
        const results = new Map<string, T>();
        
        const promises = keys.map(async (key) => {
            const config = await this.load(key);
            results.set(key, config);
        });
        
        await Promise.all(promises);
        return results;
    }
    
    /**
     * 预加载所有配置
     * 子类需要实现此方法，返回所有配置键
     */
    abstract preloadAll(): Promise<void>;
    
    /**
     * 验证配置数据
     * 子类可以重写此方法进行自定义验证
     * @param data 原始数据
     * @param key 配置键
     * @returns T 验证后的配置数据
     */
    protected validate(data: T, key: string): T {
        // 基础验证：检查数据不为空
        if (!data) {
            throw new Error(`配置数据为空: ${key}`);
        }
        return data;
    }
    
    /**
     * 清除缓存
     * @param key 可选，指定要清除的配置键。不传则清除所有
     */
    clearCache(key?: string): void {
        if (key) {
            this._cache.delete(key);
            console.log(`[ConfigManager] 清除缓存: ${key}`);
        } else {
            this._cache.clear();
            console.log(`[ConfigManager] 清除所有缓存`);
        }
    }
    
    /**
     * 获取缓存大小
     */
    getCacheSize(): number {
        return this._cache.size;
    }
}
```

**操作检查清单**：
- [ ] 文件已创建
- [ ] 代码已完整复制
- [ ] 文件头注释已包含作者信息
- [ ] 代码无语法错误（编辑器应无红色波浪线）

#### 步骤 1.1.1.3: 创建测试文件（可选）

**⚠️ 重要规则**：测试文件必须放在 `assets/script/test/` 目录下，不能与源代码放在同一目录！

**文件路径**: `assets/script/test/config/ConfigManagerTest.ts`

**操作**：
1. 创建测试目录：`assets/script/test/config/`
2. 创建测试文件并添加测试代码

**测试代码**：
```typescript
/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 配置管理器测试文件
 */

import { ConfigManager } from '../../game/common/config/ConfigManager';

export function testConfigManagerImport(): void {
    console.log('[Test] ConfigManager 导入成功！');
    if (!ConfigManager) {
        throw new Error('ConfigManager 类未找到');
    }
    console.log('[Test] ✅ ConfigManager 基类验证通过');
}
```

**操作检查清单**：
- [ ] 测试文件已创建在 `test/` 目录下
- [ ] 导入路径正确（使用相对路径 `../../game/...`）
- [ ] 代码无语法错误

#### 步骤 1.1.1.4: 验证代码编译

**操作**：
1. 保存所有文件（Ctrl+S）
2. 在 Cocos Creator 编辑器中检查控制台
3. 应该没有编译错误

**验证方法**：
```typescript
// 在测试文件中导入，检查是否能正常导入
import { ConfigManager } from 'db://assets/script/game/common/config/ConfigManager';

// 如果导入成功且无报错，说明编译通过
```

**预期结果**：
- ✅ 控制台无错误
- ✅ 代码可以正常导入
- ✅ 测试文件可以正常编译

### ⚠️ 常见问题

**问题1**: 导入路径错误
- **错误信息**: `Cannot find module 'db://assets/...'`
- **解决方案**: 检查文件路径是否正确，确保文件在 `assets` 目录下

**问题2**: TypeScript 类型错误
- **错误信息**: `Type 'unknown' is not assignable to type 'T'`
- **解决方案**: 确保 `asset.json` 的类型断言正确：`asset.json as T`

**问题3**: 缓存未生效
- **问题描述**: 每次加载都重新读取文件
- **解决方案**: 检查 `_cache.has(key)` 逻辑是否正确

---

## 任务 1.1.2: 创建关卡配置加载器

### 📋 前置条件检查

- [ ] 任务 1.1.1 已完成（ConfigManager 基类已创建）
- [ ] 已了解 Unity 的 `MissionData.cs` 结构
- [ ] 已了解 XML 配置格式（见 `UNITY_PROJECT_ANALYSIS.md`）

### 🔍 Unity源码参考

**参考文件**: `Farm/Assets/Scripts/Common/MissionData.cs`

**关键代码片段**：
```csharp
// Unity C# 代码
public class MissionData
{
    public static TargetCommon targetCommon;
    public static StarMission starMission;
    public static FarmDataMission farmDataMission;
    public static FactoryDataMission factoryDataMission;
    public static ShopDataMission shopDataMission;
    public static TownDataMission townDataMission;
    
    public static void READ_XML(int level)
    {
        readXML = new ReadXML("Mission/DataMission" + level, -1);
        targetCommon = new TargetCommon();
        targetCommon.Readxml(readXML.getDataByName("Target"));
        // ... 其他数据加载
    }
}
```

### 📝 详细步骤

#### 步骤 1.1.2.1: 创建 MissionConfig.ts 接口定义

**文件路径**: `assets/script/game/common/config/MissionConfig.ts`

**操作**：
1. 创建新文件
2. 先定义 TypeScript 接口（对应 Unity 的数据结构）

**完整代码（第一部分 - 接口定义）**：

```typescript
/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 关卡配置数据结构定义
 * 对应 Unity 的 MissionData 结构
 */

/**
 * 关卡目标通用数据
 * 对应 Unity TargetCommon
 */
export interface TargetCommonData {
    /** 初始金钱 */
    startMoney: number;
    /** 目标金钱 */
    targetMoney: number;
    /** 任务时间限制（天数） */
    timeMission: number;
    /** 最大顾客数 */
    maxCustomer: number;
    /** 目标顾客满意度 */
    targetCustomerRate: number;
    /** 商店中的物品列表 */
    itemsInShop: number[];
    /** 起始场景 */
    startScene: number;
}

/**
 * 星级评价条件
 * 对应 Unity StarMission
 */
export interface StarConditionData {
    /** 二星条件值 */
    twoStar: number;
    /** 三星条件值 */
    threeStar: number;
    /** 奖励配置 [1星奖励, 2星奖励, 3星奖励] */
    reward: number[];
}

/**
 * 农场田地数据
 * 对应 Unity FieldFarm
 */
export interface FieldFarmData {
    /** 田地ID (1=农田, 2=畜栏, 3=池塘) */
    idField: number;
    /** 初始数量 */
    startNumber: number;
    /** 目标数量 */
    targetNumber: number;
    /** 初始等级 */
    startLevel: number;
    /** 目标等级 */
    targetLevel: number;
    /** 最大等级 */
    maxLevel: number;
}

/**
 * 农场养殖数据
 * 对应 Unity BreedFarm
 */
export interface BreedFarmData {
    /** 作物/动物ID */
    idBreed: number;
    /** 初始数量 */
    startNumber: number;
    /** 目标种植数量 */
    targetNumber: number;
}

/**
 * 农场收获目标
 * 对应 Unity HarverstFarm
 */
export interface HarvestFarmData {
    /** 田地类型ID (1=农田, 2=畜栏) */
    idField: number;
    /** 目标收获数量 */
    targetNumber: number;
}

/**
 * 农场模块数据
 * 对应 Unity FarmDataMission
 */
export interface FarmDataMissionData {
    /** 是否允许生病 */
    isCanSick: boolean;
    /** 田地列表 */
    fields: FieldFarmData[];
    /** 养殖列表 */
    breeds: BreedFarmData[];
    /** 农田收获目标 */
    harvestField: HarvestFarmData;
    /** 畜栏收获目标 */
    harvestCage: HarvestFarmData;
}

/**
 * 完整关卡配置数据
 * 对应 Unity MissionData 的完整结构
 */
export interface MissionConfigData {
    /** 关卡ID */
    id: number;
    /** 目标通用数据 */
    targetCommon: TargetCommonData;
    /** 星级条件 */
    starCondition: StarConditionData;
    /** 农场数据 */
    farmData: FarmDataMissionData;
    /** 工厂数据（后续实现） */
    factoryData?: any;
    /** 商店数据（后续实现） */
    shopData?: any;
    /** 城镇数据（后续实现） */
    townData?: any;
    /** 提示文本（中文） */
    tip_vi?: string;
    /** 提示文本（英文） */
    tip_en?: string;
    /** 新物品列表 */
    newItems?: any[];
}
```

**操作检查清单**：
- [ ] 所有接口已定义
- [ ] 字段名与 Unity 对应
- [ ] 类型定义正确（number, boolean, array等）

#### 步骤 1.1.2.2: 创建 MissionConfigManager 类

**操作**：在同一文件中继续添加类定义

**完整代码（第二部分 - 配置管理器类）**：

```typescript
import { ConfigManager } from './ConfigManager';

/**
 * 关卡配置管理器
 * 继承自 ConfigManager，提供关卡配置的加载和管理
 */
export class MissionConfigManager extends ConfigManager<MissionConfigData> {
    private static _instance: MissionConfigManager | null = null;
    
    /**
     * 获取单例实例
     */
    static getInstance(): MissionConfigManager {
        if (!MissionConfigManager._instance) {
            MissionConfigManager._instance = new MissionConfigManager();
        }
        return MissionConfigManager._instance;
    }
    
    /**
     * 配置路径前缀
     */
    protected getConfigPath(): string {
        return 'bundle/config/missions';
    }
    
    /**
     * 加载指定关卡配置
     * @param level 关卡编号（1, 2, 3...）
     * @returns Promise<MissionConfigData> 关卡配置数据
     */
    async loadMission(level: number): Promise<MissionConfigData> {
        const key = `mission_${level}`;
        return await this.load(key);
    }
    
    /**
     * 预加载所有关卡配置
     * 注意：这里假设有50个关卡，实际数量需要根据项目调整
     */
    async preloadAll(): Promise<void> {
        const totalMissions = 50; // 根据实际关卡数量调整
        const keys: string[] = [];
        
        for (let i = 1; i <= totalMissions; i++) {
            keys.push(`mission_${i}`);
        }
        
        console.log(`[MissionConfigManager] 开始预加载 ${totalMissions} 个关卡配置...`);
        await this.loadBatch(keys);
        console.log(`[MissionConfigManager] 预加载完成`);
    }
    
    /**
     * 验证配置数据
     * 重写父类方法，添加关卡特定的验证逻辑
     */
    protected validate(data: MissionConfigData, key: string): MissionConfigData {
        // 调用父类验证
        const validated = super.validate(data, key);
        
        // 关卡特定验证
        if (!validated.id) {
            throw new Error(`关卡配置缺少 id 字段: ${key}`);
        }
        
        if (!validated.targetCommon) {
            throw new Error(`关卡配置缺少 targetCommon 字段: ${key}`);
        }
        
        if (!validated.targetCommon.startMoney && validated.targetCommon.startMoney !== 0) {
            console.warn(`关卡 ${validated.id} 的初始金钱未设置`);
        }
        
        return validated;
    }
    
    /**
     * 获取关卡数量
     * 这个方法需要根据实际配置文件数量来确定
     */
    getMissionCount(): number {
        return 50; // 根据实际数量调整
    }
}
```

**操作检查清单**：
- [ ] 类已继承 ConfigManager
- [ ] 单例模式已实现
- [ ] getConfigPath() 返回正确路径
- [ ] loadMission() 方法已实现
- [ ] preloadAll() 方法已实现

#### 步骤 1.1.2.3: 创建便捷导出

**操作**：在文件末尾添加导出

**完整代码（第三部分 - 导出）**：

```typescript
// 导出单例实例的便捷访问
export const missionConfig = MissionConfigManager.getInstance();
```

**完整文件结构**：
```typescript
// 1. 接口定义
export interface TargetCommonData { ... }
export interface StarConditionData { ... }
// ... 其他接口

// 2. 配置管理器类
export class MissionConfigManager extends ConfigManager<MissionConfigData> { ... }

// 3. 便捷导出
export const missionConfig = MissionConfigManager.getInstance();
```

#### 步骤 1.1.2.4: 创建测试用例

**文件路径**: `assets/script/game/common/config/MissionConfigTest.ts`

**操作**：创建测试文件验证配置加载器

**完整代码**：

```typescript
/**
 * 关卡配置管理器测试
 * 用于验证配置加载功能
 */

import { missionConfig, MissionConfigData } from './MissionConfig';

/**
 * 测试加载第1关配置
 */
export async function testLoadMission1(): Promise<void> {
    console.log('[Test] 开始测试加载关卡1配置...');
    
    try {
        const config = await missionConfig.loadMission(1);
        
        console.log('[Test] ✅ 加载成功！');
        console.log('[Test] 关卡ID:', config.id);
        console.log('[Test] 初始金钱:', config.targetCommon.startMoney);
        console.log('[Test] 目标金钱:', config.targetCommon.targetMoney);
        console.log('[Test] 时间限制:', config.targetCommon.timeMission);
        console.log('[Test] 农场田地数量:', config.farmData?.fields?.length || 0);
        
        // 验证数据完整性
        if (!config.id) {
            throw new Error('关卡ID缺失');
        }
        if (config.targetCommon.startMoney === undefined) {
            throw new Error('初始金钱缺失');
        }
        
        console.log('[Test] ✅ 数据验证通过！');
    } catch (error) {
        console.error('[Test] ❌ 测试失败:', error);
        throw error;
    }
}

/**
 * 测试预加载所有配置
 */
export async function testPreloadAll(): Promise<void> {
    console.log('[Test] 开始测试预加载所有配置...');
    
    try {
        await missionConfig.preloadAll();
        const cacheSize = missionConfig.getCacheSize();
        
        console.log(`[Test] ✅ 预加载完成！缓存大小: ${cacheSize}`);
        
        if (cacheSize === 0) {
            throw new Error('预加载后缓存为空');
        }
    } catch (error) {
        console.error('[Test] ❌ 预加载测试失败:', error);
        throw error;
    }
}
```

**操作检查清单**：
- [ ] 测试文件已创建
- [ ] 测试函数已实现
- [ ] 错误处理已添加

### ✅ 验证方法

#### 验证步骤 1: 编译检查

**操作**：
1. 保存所有文件
2. 检查 Cocos Creator 控制台
3. 应该无编译错误

**预期结果**：
- ✅ 无编译错误
- ✅ 无类型错误

#### 验证步骤 2: 手动测试（需要先创建JSON配置文件）

**操作**：
1. 创建测试配置文件 `assets/bundle/config/missions/mission_1.json`
2. 添加测试数据（见下一步）
3. 在游戏启动代码中调用测试函数

**测试配置文件内容**：

```json
{
  "id": 1,
  "targetCommon": {
    "startMoney": 500,
    "targetMoney": 1000,
    "timeMission": 7,
    "maxCustomer": 100,
    "targetCustomerRate": 0,
    "itemsInShop": [1, 2, 3],
    "startScene": 1
  },
  "starCondition": {
    "twoStar": 100,
    "threeStar": 200,
    "reward": [1, 2, 3]
  },
  "farmData": {
    "isCanSick": false,
    "fields": [
      {
        "idField": 1,
        "startNumber": 2,
        "targetNumber": 0,
        "startLevel": 1,
        "targetLevel": 1,
        "maxLevel": 1
      }
    ],
    "breeds": [
      {
        "idBreed": 1,
        "startNumber": 0,
        "targetNumber": 1
      }
    ],
    "harvestField": {
      "idField": 1,
      "targetNumber": 0
    },
    "harvestCage": {
      "idField": 2,
      "targetNumber": 0
    }
  }
}
```

**在 InitRes.ts 中添加测试代码**：

```typescript
// 在适当位置添加
import { testLoadMission1 } from 'db://assets/script/game/common/config/MissionConfigTest';

// 在初始化完成后调用
testLoadMission1().then(() => {
    console.log('配置加载测试完成');
}).catch((err) => {
    console.error('配置加载测试失败:', err);
});
```

**预期结果**：
- ✅ 控制台输出加载成功信息
- ✅ 配置数据正确打印
- ✅ 无错误信息

### ⚠️ 常见问题

**问题1**: 配置文件路径错误
- **错误信息**: `加载配置失败: bundle/config/missions/mission_1`
- **解决方案**: 
  1. 检查文件是否在 `assets/bundle/config/missions/` 目录下
  2. 检查文件名是否为 `mission_1.json`（注意：resources.load 不需要扩展名）
  3. 检查 bundle 配置是否正确

**问题2**: JSON 格式错误
- **错误信息**: `配置数据为空` 或 `Unexpected token`
- **解决方案**: 
  1. 使用 JSON 验证工具检查格式
  2. 确保所有字符串用双引号
  3. 确保最后一个属性后无逗号

**问题3**: 类型不匹配
- **错误信息**: `Type 'X' is not assignable to type 'Y'`
- **解决方案**: 
  1. 检查 JSON 中的数据类型（数字不要加引号）
  2. 检查接口定义是否正确
  3. 使用类型断言：`data as MissionConfigData`

---

## 任务 1.1.3: 将 XML 关卡配置转为 JSON

### 📋 前置条件检查

- [ ] 任务 1.1.2 已完成（MissionConfigManager 已创建）
- [ ] 已找到 Unity 的 XML 配置文件位置
- [ ] 已安装 Node.js（用于运行转换脚本）

### 🔍 Unity源码参考

**参考文件**: `Farm/Assets/Resources/Mission/DataMission1.xml` 到 `DataMission50.xml`

**示例 XML 结构**（DataMission1.xml）：
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

### 📝 详细步骤

#### 步骤 1.1.3.1: 检查转换工具

**操作**：
1. 检查 `tools/scripts/convert-missions.js` 是否存在
2. 如果不存在，需要先创建（见 `TOOLS_GUIDE.md`）

**验证**：
```bash
# 在项目根目录
Test-Path "tools/scripts/convert-missions.js"
```

#### 步骤 1.1.3.2: 运行转换脚本

**操作**：
1. 打开终端/命令行
2. 进入项目根目录
3. 运行转换脚本

**命令**：
```bash
# Windows PowerShell
cd E:\gitproject\cocos\Farm
node tools/scripts/convert-missions.js
```

**预期输出**：
```
开始转换关卡配置...
转换 DataMission1.xml -> mission_1.json ✅
转换 DataMission2.xml -> mission_2.json ✅
...
转换完成！共转换 50 个关卡
```

#### 步骤 1.1.3.3: 验证转换结果

**操作**：
1. 检查输出目录 `assets/bundle/config/missions/`
2. 应该看到 `mission_1.json` 到 `mission_50.json`
3. 打开一个 JSON 文件检查格式

**验证清单**：
- [ ] 文件数量正确（50个）
- [ ] JSON 格式正确（可以用 JSON 验证工具）
- [ ] 数据字段完整（id, targetCommon, farmData等）
- [ ] 数值类型正确（数字不加引号）

#### 步骤 1.1.3.4: 手动验证第一个配置文件

**操作**：
1. 打开 `assets/bundle/config/missions/mission_1.json`
2. 对比 Unity 的 `DataMission1.xml`
3. 确保数据对应正确

**对比检查点**：
- [ ] `targetCommon.startMoney` = XML 的 `Target.startMoney`
- [ ] `targetCommon.timeMission` = XML 的 `Target.timeMission`
- [ ] `starCondition.twoStar` = XML 的 `Star.twoStar`
- [ ] `starCondition.threeStar` = XML 的 `Star.threeStar`
- [ ] `farmData.fields` 数组包含 XML 的 `Farm.Field` 节点
- [ ] `farmData.breeds` 数组包含 XML 的 `Farm.Seed` 节点

### ✅ 验证方法

#### 验证步骤: 使用配置管理器加载

**操作**：
1. 在游戏启动代码中调用 `testLoadMission1()`
2. 检查控制台输出

**预期结果**：
- ✅ 配置加载成功
- ✅ 数据与 XML 一致
- ✅ 无错误信息

### ⚠️ 常见问题

**问题1**: 转换脚本找不到 XML 文件
- **错误信息**: `Cannot find file: DataMission1.xml`
- **解决方案**: 
  1. 检查 `tools/config.js` 中的路径配置
  2. 确认 Unity 项目路径正确
  3. 确认 XML 文件确实存在

**问题2**: JSON 格式错误
- **错误信息**: `Unexpected token` 或 `SyntaxError`
- **解决方案**: 
  1. 检查转换脚本中的 JSON 序列化代码
  2. 确保特殊字符已转义
  3. 使用 `JSON.stringify()` 而不是手动拼接

**问题3**: 数据丢失
- **问题描述**: JSON 中缺少某些字段
- **解决方案**: 
  1. 检查转换脚本是否处理了所有 XML 节点
  2. 对比 XML 和 JSON，找出缺失的字段
  3. 更新转换脚本

---

## 下一步任务

完成 Sprint 1 后，继续：

### Sprint 2: 核心数据模型

- [ ] 1.2.1 ItemBase 基础数据类
- [ ] 1.2.2 MissionData 任务数据
- [ ] 1.2.4 FarmData 农场数据

详细步骤将在后续更新...

---

*最后更新：2025-01-07*
