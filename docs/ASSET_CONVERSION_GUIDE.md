# 资源转换规范

## 概述

本文档详细说明Unity资源转换为Cocos Creator资源的规范和最佳实践。

---

## 1. 目录结构

### 1.1 Unity资源结构

```
Assets/
├── Animations/        # 动画文件
├── Images/           # 图片资源
├── Sounds/           # 音频文件
├── Prefabs/          # 预制体
├── Resources/        # 运行时加载资源
├── Scenes/           # 场景文件
├── Scripts/          # 脚本文件
└── Fonts/            # 字体文件
```

### 1.2 Cocos目标结构

```
assets/
├── bundle/                    # Asset Bundle（按需加载）
│   ├── common/               # 公共资源
│   │   ├── prefab/          # 公共预制体
│   │   └── texture/         # 公共纹理
│   ├── config/              # 配置文件（JSON）
│   ├── game/                # 游戏资源
│   │   ├── farm/           # 农场模块资源
│   │   ├── factory/        # 工厂模块资源
│   │   ├── store/          # 商店模块资源
│   │   └── town/           # 城镇模块资源
│   ├── gui/                 # UI资源
│   │   ├── common/         # 公共UI
│   │   ├── farm/           # 农场UI
│   │   ├── factory/        # 工厂UI
│   │   ├── store/          # 商店UI
│   │   ├── town/           # 城镇UI
│   │   ├── menu/           # 菜单UI
│   │   └── logo/           # Logo界面
│   ├── audio/              # 音频资源
│   │   ├── bgm/            # 背景音乐
│   │   └── sfx/            # 音效
│   └── language/           # 多语言资源
├── resources/              # 首包资源（启动即加载）
│   ├── loading/           # 加载界面
│   └── config.json        # 全局配置
├── scene/                  # 场景文件
└── script/                 # 脚本文件
```

---

## 2. 图片资源转换

### 2.1 格式要求

| Unity格式 | Cocos格式 | 说明 |
|-----------|-----------|------|
| `.png` | `.png` | 直接使用 |
| `.jpg` | `.jpg` | 直接使用 |
| `.psd` | `.png` | 导出为PNG |
| `.tga` | `.png` | 导出为PNG |
| `.bmp` | `.png` | 转换为PNG |

### 2.2 图集处理

**Unity NGUI图集**
```
Assets/Images/Store/Store.png     # 图集图片
Assets/Images/Store/Store.prefab  # NGUI Atlas预制体
```

**Cocos处理方案**

方案A：使用Auto Atlas（推荐）
```
assets/bundle/gui/store/
├── images/              # 散图文件夹
│   ├── btn_buy.png
│   ├── btn_sell.png
│   └── icon_coin.png
└── auto_atlas.pac       # 自动图集配置
```

方案B：使用TexturePacker生成
```
assets/bundle/gui/store/
├── store.plist          # 图集配置
└── store.png            # 合并后的图集
```

### 2.3 命名规范

| 类型 | 前缀 | 示例 |
|------|------|------|
| 按钮 | `btn_` | `btn_start.png` |
| 图标 | `icon_` | `icon_coin.png` |
| 背景 | `bg_` | `bg_farm.png` |
| 头像 | `avatar_` | `avatar_player.png` |
| 特效 | `fx_` | `fx_particle.png` |
| 边框 | `frame_` | `frame_dialog.png` |

### 2.4 分辨率适配

Unity原始设计分辨率：`960 x 640`（横屏）

Cocos适配策略：
```typescript
// 在Main.ts中设置
import { view, ResolutionPolicy } from 'cc';

// 设计分辨率
view.setDesignResolutionSize(960, 640, ResolutionPolicy.SHOW_ALL);
```

---

## 3. 音频资源转换

### 3.1 格式要求

| Unity格式 | Cocos格式 | 用途 |
|-----------|-----------|------|
| `.mp3` | `.mp3` | BGM/SFX |
| `.ogg` | `.ogg` → `.mp3` | 需转换（Web兼容） |
| `.wav` | `.mp3` | 转换减小体积 |

### 3.2 音频分类

```
assets/bundle/audio/
├── bgm/                    # 背景音乐
│   ├── bgm_menu.mp3       # 菜单音乐
│   ├── bgm_game_1.mp3     # 游戏音乐1
│   └── bgm_game_2.mp3     # 游戏音乐2
└── sfx/                    # 音效
    ├── sfx_click.mp3      # 点击
    ├── sfx_coin.mp3       # 金币
    ├── sfx_harvest.mp3    # 收获
    ├── sfx_warning.mp3    # 警告
    └── sfx_success.mp3    # 成功
```

### 3.3 Unity音频对照

| Unity文件 | Cocos文件 |
|-----------|-----------|
| `Nhac menu.mp3` | `bgm/bgm_menu.mp3` |
| `Nhac nen 1.mp3` | `bgm/bgm_game_1.mp3` |
| `Nhac nen 2.mp3` | `bgm/bgm_game_2.mp3` |
| `Click 1.ogg` | `sfx/sfx_click.mp3` |
| `Canh bao.ogg` | `sfx/sfx_warning.mp3` |
| `Thang.mp3` | `sfx/sfx_win.mp3` |
| `Thua.mp3` | `sfx/sfx_lose.mp3` |

---

## 4. 预制体转换

### 4.1 Unity Prefab → Cocos Prefab

Unity预制体无法直接转换，需要手动重建。

**转换流程**：
1. 分析Unity预制体结构
2. 在Cocos编辑器中创建节点层次
3. 添加对应组件
4. 设置属性
5. 保存为预制体

### 4.2 预制体目录映射

| Unity路径 | Cocos路径 |
|-----------|-----------|
| `Resources/Common/*.prefab` | `bundle/gui/common/*.prefab` |
| `Resources/Farm/*.prefab` | `bundle/gui/farm/*.prefab` |
| `Resources/Factory/*.prefab` | `bundle/gui/factory/*.prefab` |
| `Resources/Shop/*.prefab` | `bundle/gui/store/*.prefab` |
| `Resources/Town/*.prefab` | `bundle/gui/town/*.prefab` |

### 4.3 预制体命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 界面 | `{module}_view.prefab` | `farm_view.prefab` |
| 弹窗 | `dialog_{name}.prefab` | `dialog_confirm.prefab` |
| 列表项 | `item_{name}.prefab` | `item_product.prefab` |
| 组件 | `comp_{name}.prefab` | `comp_field.prefab` |

---

## 5. XML → JSON/Excel 配置转换

### 5.1 转换策略

- **关卡配置**（50个XML）→ **单个Excel文件** → JSON
- **物品配置** → **Excel文件** → JSON
- **多语言** → **Excel文件** → JSON

### 5.2 Excel结构设计

**Mission.xlsx（任务配置）**

Sheet: `TargetCommon`
| id | startMoney | startDay | maxTimeOfMission | ... |
|----|------------|----------|------------------|-----|
| 1 | 100 | 1 | 30 | ... |
| 2 | 150 | 1 | 35 | ... |

Sheet: `FarmData`
| missionId | fieldIndex | startLevel | targetLevel | ... |
|-----------|------------|------------|-------------|-----|
| 1 | 0 | 1 | 2 | ... |

Sheet: `StarCondition`
| missionId | starIndex | conditionType | targetValue |
|-----------|-----------|---------------|-------------|
| 1 | 1 | time | 25 |
| 1 | 2 | money | 500 |
| 1 | 3 | products | 10 |

### 5.3 生成的JSON结构

```json
// bundle/config/MissionConfig.json
{
  "missions": [
    {
      "id": 1,
      "targetCommon": {
        "startMoney": 100,
        "startDay": 1,
        "maxTimeOfMission": 30
      },
      "farmData": {
        "fields": [...]
      },
      "starConditions": [
        { "star": 1, "type": "time", "value": 25 },
        { "star": 2, "type": "money", "value": 500 },
        { "star": 3, "type": "products", "value": 10 }
      ]
    }
  ]
}
```

### 5.4 XML转换示例

**Unity XML**
```xml
<!-- DataMission1.xml -->
<mission id="1">
  <targetCommon>
    <startMoney>100</startMoney>
    <startDay>1</startDay>
    <maxTimeOfMission>30</maxTimeOfMission>
  </targetCommon>
  <farmData>
    <field index="0" startLevel="1" targetLevel="2"/>
  </farmData>
</mission>
```

**转换后JSON**
```json
{
  "id": 1,
  "targetCommon": {
    "startMoney": 100,
    "startDay": 1,
    "maxTimeOfMission": 30
  },
  "farmData": {
    "fields": [
      { "index": 0, "startLevel": 1, "targetLevel": 2 }
    ]
  }
}
```

---

## 6. 场景转换

### 6.1 场景映射

| Unity场景 | Cocos场景 | 说明 |
|-----------|-----------|------|
| `LogoScene.unity` | - | 用预制体替代 |
| `Menu.unity` | - | 用预制体替代 |
| `LoadingScene.unity` | - | 用预制体替代 |
| `Farm.unity` | `scene/Farm.scene` | 可选 |
| `Factory.unity` | `scene/Factory.scene` | 可选 |
| `Store.unity` | `scene/Store.scene` | 可选 |
| `Town.unity` | `scene/Town.scene` | 可选 |

### 6.2 场景与预制体选择

**推荐方案：单场景 + 多预制体**

只保留一个主场景 `main_master.scene`，所有界面使用预制体动态加载。

优点：
- 资源管理统一
- 热更新更方便
- 减少场景切换开销

```typescript
// 使用Oops Framework GUI系统
oops.gui.open(UIID.Farm);    // 打开农场界面
oops.gui.open(UIID.Factory); // 打开工厂界面
```

---

## 7. 动画资源转换

### 7.1 Animator Controller

Unity的Animator Controller需要手动在Cocos中重建。

**步骤**：
1. 导出动画序列帧（如果是帧动画）
2. 在Cocos中创建Animation Clip
3. 设置关键帧
4. 创建Animation Graph（如需状态机）

### 7.2 帧动画

**Unity帧动画结构**
```
Assets/Images/Menu/cd/
├── cd_1.png
├── cd_2.png
├── cd_3.png
└── ...
```

**Cocos帧动画制作**
1. 导入所有帧图片
2. 创建SpriteFrame资源
3. 创建Animation Clip
4. 在每帧设置不同的SpriteFrame

### 7.3 Tween动画

大部分Unity iTween动画通过代码实现，转换为Cocos的Tween系统。

参见 `CODE_CONVERSION_GUIDE.md` 第6节。

---

## 8. 字体资源

### 8.1 系统字体

直接使用Label组件的系统字体选项。

### 8.2 位图字体（Bitmap Font）

**Unity BMFont**
```
Assets/Fonts/
├── GameFont.fnt
└── GameFont.png
```

**Cocos处理**
1. 保留.fnt和.png文件
2. 导入到 `assets/bundle/common/font/`
3. 在Label组件中选择该字体

### 8.3 TrueType字体

**转换步骤**
1. 获取TTF字体文件
2. 导入到 `assets/bundle/common/font/`
3. 在Label组件中选择

---

## 9. 资源加载最佳实践

### 9.1 Bundle分包策略

```typescript
// bundle配置示例
// bundle/gui/bundle.json
{
  "name": "gui",
  "priority": 1,
  "compressionType": "none"
}
```

### 9.2 加载顺序

```
1. resources（首包，启动加载）
   └── loading界面、config.json

2. common（公共资源，启动后立即加载）
   └── 通用UI、通用音效

3. 模块bundle（按需加载）
   └── farm、factory、store、town

4. language（语言包，根据设置加载）
   └── zh、en
```

### 9.3 预加载策略

```typescript
import { oops } from "db://oops-framework/core/Oops";

// 预加载bundle
async preloadBundles() {
    await oops.res.loadBundle('common');
    await oops.res.loadBundle('gui');
    await oops.res.loadBundle('audio');
    await oops.res.loadBundle('config');
}

// 按需加载模块
async enterFarm() {
    await oops.res.loadBundle('game/farm');
    oops.gui.open(UIID.Farm);
}
```

---

## 10. 资源转换检查清单

### 10.1 图片资源

- [ ] 所有PNG/JPG已复制到对应目录
- [ ] 文件名已转为小写下划线格式
- [ ] 图集已配置Auto Atlas
- [ ] 九宫格切片已设置

### 10.2 音频资源

- [ ] 所有OGG已转换为MP3
- [ ] 音频已分类（BGM/SFX）
- [ ] 文件名已规范化

### 10.3 配置文件

- [ ] 所有XML已转换为JSON/Excel
- [ ] 数据结构已验证
- [ ] 配置加载器已创建

### 10.4 预制体

- [ ] UI层次结构已重建
- [ ] 组件已正确添加
- [ ] 属性已正确设置
- [ ] 脚本已绑定

### 10.5 动画

- [ ] 帧动画已重建
- [ ] 骨骼动画已导入（如有）
- [ ] Animation Clip已测试

---

## 11. 资源清单

### 11.1 Unity资源统计

| 类型 | 数量 | 说明 |
|------|------|------|
| XML配置 | 92+ | 任务、物品等配置 |
| PNG图片 | 1000+ | UI、游戏素材 |
| 音频文件 | 40+ | BGM、SFX |
| Prefab | 200+ | 预制体 |
| Animator | 20+ | 动画控制器 |
| 场景 | 9 | 游戏场景 |

### 11.2 转换优先级

| 优先级 | 资源类型 | 数量 |
|--------|----------|------|
| P0 | 启动流程资源 | ~20 |
| P1 | 农场模块资源 | ~100 |
| P2 | 工厂模块资源 | ~80 |
| P3 | 商店模块资源 | ~60 |
| P4 | 城镇模块资源 | ~80 |
| P5 | 其他模块资源 | ~200 |

---

*最后更新：2025-01-07*
