# 迁移工具使用指南

## 概述

本工具集用于将 Unity Farm 项目资源转换为 Cocos Creator 格式。工具位于 `E:\gitproject\cocos\Farm\tools` 目录，独立于 FutureFarm 项目之外。

---

## 目录结构

```
tools/
├── package.json          # npm 配置和脚本
├── config.js             # 路径配置
├── scripts/
│   ├── convert-crops.js      # 作物配置转换
│   ├── convert-missions.js   # 关卡配置转换
│   ├── convert-all.js        # 一键转换所有配置
│   ├── export-images.js      # 图片资源导出
│   ├── export-audio.js       # 音频资源导出
│   └── validate-json.js      # JSON 格式验证
└── README.md
```

---

## 快速开始

### 1. 安装依赖

```bash
cd E:\gitproject\cocos\Farm\tools
npm install
```

### 2. 配置路径

编辑 `config.js`，确认源项目和目标项目路径正确：

```javascript
module.exports = {
    unity: {
        root: '../Farm',
        resources: '../Farm/Assets/Resources',
        scripts: '../Farm/Assets/Scripts',
        images: '../Farm/Assets/Images',
        sounds: '../Farm/Assets/Sounds',
    },
    cocos: {
        root: '../FutureFarm',
        assets: '../FutureFarm/assets',
        bundle: '../FutureFarm/assets/bundle',
        config: '../FutureFarm/assets/bundle/config',
        gui: '../FutureFarm/assets/bundle/gui',
        audio: '../FutureFarm/assets/bundle/audio',
    },
    convert: {
        missionCount: 50,    // 关卡数量
        overwrite: true,     // 是否覆盖已存在文件
        verbose: true,       // 是否输出详细日志
    }
};
```

### 3. 运行转换

```bash
# 一键转换所有配置
npm run convert:all

# 或分别运行
npm run convert:crops     # 作物配置
npm run convert:missions  # 关卡配置

# 验证生成的 JSON
npm run validate
```

---

## 工具详解

### 1. 作物配置转换 (convert-crops.js)

**功能**：将 `ElementFarm.xml` 转换为 `crops.json`

**输入**：
```
Farm/Assets/Resources/Farm/XMLFile/ElementFarm.xml
```

**输出**：
```
FutureFarm/assets/bundle/config/farm/crops.json
```

**运行**：
```bash
npm run convert:crops
```

**输出格式**：
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
            "price": 10,
            "growTime": 60,
            "yields": [1, 3],
            "icon": "crop_wheat",
            "stages": ["seed", "sprout", "mature"]
        }
    ]
}
```

---

### 2. 关卡配置转换 (convert-missions.js)

**功能**：将 `DataMission*.xml` 转换为 `mission_*.json`

**输入**：
```
Farm/Assets/Resources/Mission/DataMission1.xml
Farm/Assets/Resources/Mission/DataMission2.xml
...
Farm/Assets/Resources/Mission/DataMission50.xml
```

**输出**：
```
FutureFarm/assets/bundle/config/mission/mission_1.json
FutureFarm/assets/bundle/config/mission/mission_2.json
...
FutureFarm/assets/bundle/config/mission/missions_summary.json
```

**运行**：
```bash
npm run convert:missions
```

**输出格式**：
```json
{
    "id": 1,
    "name": "关卡 1",
    "description": "",
    "initialResources": {
        "gold": 1000,
        "diamond": 0
    },
    "timeLimit": 300,
    "starConditions": {
        "star1": 100,
        "star2": 200,
        "star3": 300
    },
    "farm": {
        "fields": [
            {
                "id": 1,
                "position": { "x": 0, "y": 0 },
                "unlocked": true,
                "breed": null
            }
        ],
        "unlockedCrops": ["wheat", "tomato"]
    },
    "factory": {
        "machines": []
    },
    "store": {
        "items": []
    },
    "targets": [
        {
            "type": "harvest",
            "itemId": 1,
            "itemName": "wheat",
            "required": 10,
            "current": 0,
            "completed": false
        }
    ],
    "unlockRequires": {
        "previousMission": 0,
        "stars": 0
    }
}
```

---

### 3. 图片资源导出 (export-images.js)

**功能**：将 Unity Images 目录复制并整理到 Cocos gui 目录

**输入**：
```
Farm/Assets/Images/
```

**输出**：
```
FutureFarm/assets/bundle/gui/
├── farm/
├── factory/
├── store/
├── town/
├── common/
├── background/
└── logo/
```

**运行**：
```bash
npm run export:images
```

**映射规则**：
| 源目录 | 目标目录 |
|--------|----------|
| `Farm/**/*.png` | `gui/farm/` |
| `Factory/**/*.png` | `gui/factory/` |
| `Store/**/*.png` | `gui/store/` |
| `Town/**/*.png` | `gui/town/` |
| `UI/**/*.png` | `gui/common/` |
| `Background/**/*.png` | `gui/background/` |
| `logo*.png` | `gui/logo/` |

**文件名规范化**：
- `PascalCase` → `snake_case`
- 移除空格，转为下划线
- 全部转为小写

---

### 4. 音频资源导出 (export-audio.js)

**功能**：将 Unity Sounds 目录复制并分类到 Cocos audio 目录

**输入**：
```
Farm/Assets/Sounds/
```

**输出**：
```
FutureFarm/assets/bundle/audio/
├── bgm/      # 背景音乐
├── sfx/      # 音效
├── ui/       # UI 音效
├── game/     # 游戏音效
└── misc/     # 其他
```

**运行**：
```bash
npm run export:audio
```

**分类规则**：
| 文件名前缀 | 分类目录 |
|------------|----------|
| `bgm_*`, `music_*`, `bg_*` | `bgm/` |
| `sfx_*`, `se_*`, `sound_*` | `sfx/` |
| `ui_*`, `click_*`, `button_*` | `ui/` |
| `game_*`, `farm_*`, `harvest_*` | `game/` |
| 其他 | `misc/` |

**OGG 转换**：
- 如果系统安装了 `ffmpeg`，自动将 OGG 转换为 MP3
- 未安装 ffmpeg 则直接复制 OGG 文件

---

### 5. JSON 验证 (validate-json.js)

**功能**：验证生成的 JSON 文件格式正确性

**运行**：
```bash
npm run validate
```

**验证规则**：

| 文件 | 验证内容 |
|------|----------|
| `crops.json` | 必须包含 `version`、`crops` 数组，作物必须有 `id`、`key`、`type` 等字段 |
| `mission_*.json` | 必须包含 `id`、`name`、`farm`、`targets`，targets 必须有 `type` 和 `required` |
| `missions_summary.json` | `totalMissions` 数量必须与 `missions` 数组长度一致 |

---

## npm 脚本汇总

```bash
# 配置转换
npm run convert:crops     # 转换作物配置
npm run convert:missions  # 转换关卡配置
npm run convert:all       # 转换所有配置

# 资源导出
npm run export:images     # 导出图片资源
npm run export:audio      # 导出音频资源

# 验证
npm run validate          # 验证 JSON 格式
```

---

## 常见问题

### Q1: 找不到输入文件
**原因**：Unity 项目路径配置错误
**解决**：检查 `config.js` 中的 `unity.resources` 路径

### Q2: OGG 文件未转换为 MP3
**原因**：系统未安装 ffmpeg
**解决**：安装 ffmpeg 并确保在 PATH 中
```bash
# Windows (使用 chocolatey)
choco install ffmpeg

# 或下载安装包添加到 PATH
```

### Q3: 中文乱码
**原因**：XML 文件编码问题
**解决**：确保 XML 文件使用 UTF-8 编码

### Q4: 验证失败
**原因**：XML 格式与预期不符
**解决**：检查错误信息，修改转换脚本适配实际格式

---

## 扩展开发

### 添加新的转换脚本

1. 在 `scripts/` 目录创建新脚本
2. 在 `package.json` 添加 npm script
3. 如需纳入一键转换，修改 `convert-all.js`

### 添加新的验证规则

修改 `validate-json.js` 中的 `VALIDATION_RULES` 对象：

```javascript
VALIDATION_RULES['new_config.json'] = {
    required: ['field1', 'field2'],
    validate: (data) => {
        const errors = [];
        // 自定义验证逻辑
        return errors;
    }
};
```

---

## 依赖说明

| 依赖 | 版本 | 用途 |
|------|------|------|
| xml2js | ^0.6.2 | XML 解析 |
| fs-extra | ^11.2.0 | 文件操作增强 |
| glob | ^10.3.10 | 文件匹配 |
| chalk | ^4.1.2 | 终端颜色（可选） |

---

*最后更新：2025-01-07*
